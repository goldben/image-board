(function() {
  var vm = new Vue({
    el: "#main",
    data: {
      clickedImg: location.hash.slice(1),
      images: [],
      getMoreButton: false,
      form: {
        title: "",
        description: "",
        username: "",
        file: null
      }
    },
    mounted: function() {
      var self = this;
      axios
        .get("/images")
        .then(function(resp) {
          self.images = resp.data;
          if (
            self.images[self.images.length - 1].id !=
            self.images[self.images.length - 1].lowest_id
          ) {
            self.getMoreButton = true;
          }
        })
        .catch(function(e) {
          console.log("GET IMAGES:", e);
        });
      addEventListener("hashchange", function() {
        self.clickedImg = location.hash.slice(1);
        console.log("clicked img is now", self.clickedImg);
      });
    },

    methods: {
      deleteImg: function() {
        var self = this;
        var e = this.clickedImg;
        console.log("deleteImg fires", e);
        axios.post("delete/" + e).then(function() {
          console.log("image ", e, " deleted");
          for (var i = self.images.length - 1; i > 0; i--) {
            if (self.images[i].id === e) {
              self.images.splice(i, 1);
            }
          }
        });
        location.hash = "";
      },
      getMoreImages: function() {
        console.log("trying to load more");
        var self = this;
        let lastId = this.images[this.images.length - 1].id;
        console.log("last id is ", lastId);
        axios.get("/get-more-images/" + lastId).then(function(resp) {
          self.images = self.images.concat(resp.data);
          console.log("axios responsd: ", resp);
          if (
            self.images[self.images.length - 1].id ===
            self.images[self.images.length - 1].lowest_id
          ) {
            self.getMoreButton = false;
          }
        });
      },
      getImages: function() {
        var self = this;
        axios.get("/images").then(function(resp) {
          self.images = resp.data;
          if (
            self.images[self.images.length - 1].id !=
            self.images[self.images.length - 1].lowest_id
          ) {
            self.getMoreButton = true;
          }
        });
      },
      handleFileChange: function(e) {
        this.form.file = e.target.files[0];
      },

      uploadFile: function() {
        var self = this;
        var formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("username", this.form.username);
        formData.append("description", this.form.description);
        if (this.form.file) {
          formData.append("file", this.form.file);
          axios.post("/upload", formData).then(function(resp) {
            console.log("resp in POST /upload", resp);
            self.getImages();
          });
        } else if (this.form.url) {
          console.log("made it", this.form.url);
          var formUrl = {
            title: this.form.title,
            description: this.form.description,
            username: this.form.username,
            url: this.form.url
          };
          axios.post("/upload-from-url", formUrl).then(function(resp) {
            console.log("resp in POST /upload-url", resp);
            self.getImages();
          });
        }
      },
      onclosepopup: function() {
        console.log("close!");
        this.clickedImg = null;
        location.hash = "";
      }
    }
  });
  /////////////// enlarged image popup component/////////////////////
  var vmc = Vue.component("popup", {
    props: ["clickedImg", "onClosePopup", "deleteImg"],
    data: function() {
      return {
        imageInfo: [],
        comments: [],
        form: {
          username: "",
          comment: "",
          imageId: ""
        }
      };
    },
    mounted: function() {
      var self = this;
      console.log("popup mounted");

      axios.get("/popup-data/" + this.clickedImg).then(function(resp) {
        console.log("resp", resp);
        self.imageInfo = resp.data.imageInfo;
        self.comments = resp.data.comments;
        console.log("imageInfo", self.imageInfo);
      });
    },
    methods: {
      submitComment: function() {
        var self = this;
        var formData = new FormData();
        formData.append("username", "this.form.username");
        formData.append("comment", this.form.comment);

        this.form.imageId = this.clickedImg;

        axios.post("/addcomment", this.form).then(function(resp) {
          console.log("resp in POST /addcomment", resp);
          self.comments.push(resp.data);
        });
      },
      closepopup: function() {
        console.log("close it");
        this.$emit("close-it");
      },
      backbtn: function() {
        console.log("back btn clicked", location.hash.slice(1) - 1);
        location.hash = Number(location.hash.slice(1)) - 1;
      },
      nextbtn: function() {
        console.log("next btn clicked", Number(location.hash.slice(1)) + 1);
        location.hash = Number(location.hash.slice(1)) + 1;
      }
    },
    watch: {
      clickedImg: function() {
        var self = this;
        console.log("popup mounted");

        axios
          .get("/popup-data/" + this.clickedImg)
          .then(function(resp) {
            console.log("axios response", resp);
            self.imageInfo = resp.data.imageInfo;
            self.comments = resp.data.comments;
            console.log("imageInfo", self.imageInfo);
            if (self.imageInfo == undefined) {
              console.log("sorry, image does not exist!");
              self.closepopup();
              location.hash = "";
            }
          })
          .catch(function(e) {
            console.log("watch axios error", e);
          });
      }
    },
    template: "#popup-template"
  });
})();
