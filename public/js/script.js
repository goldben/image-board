//all the vue code goes in this file
var vm;
(function() {
	vm = new Vue({
		//most vue code goes here
		el: '#main',
		data: {
			showPopup: false,
			images: [],
			form: {
				title: '',
				description: '',
				username: '',
				file: 'null'
			},
			popupData: {
				title: '',
				imageUrl: '',
				description: '',
				comments: ''
			}
		}, // closes data
		// mounted method has a life cicle
		mounted: function() {
			var self = this;
			// here we'll make axios requests to get data from the server that we need to the render on screen
			axios.get('/images').then(function(resp) {
				//			console.log('GET/cities', resp.data);
				//			console.log('self: ' , self);
				self.images = resp.data;
				console.log('self.images:', self.images);
			});
		}, //close mounted

		methods: {
			//every response to an event is defind here
			handleFileChange: function(e) {
				//console.log('handle change e:', e);
				//e.target.files[0];
				console.log("this: ", this)
				this.form.file = e.target.files[0];
			},
			uploadFile: function() {
				// console.log('upload file');
				var formData = new FormData();
				formData.append('file', this.form.file);
				formData.append('username', this.form.username);
				formData.append('description', this.form.description)
				// if you console.log formData and get an{} thats ok
				axios.post('/upload', formData)
					.then(function(resp) {
						console.log('resp in POST /upload', resp);
					})
			},
			onClickGalleryImage: function(imageData) {
				this.showPopup = true;
				this.popupData = {
					imageId: imageData.id,
					title: imageData.title,
					imageUrl: imageData.url,
					description: imageData.description,
					comments: imageData.comments
				}
			},
			onClosePopup: function() {
				console.log("close!")
				this.showPopup = false;
			}
		}

	}); //closes Vue instance
	// pop image component for showing the clicked image in a popup
	Vue.component('popup', {
		props: [
			'imageId',
			'imageUrl',
			'title',
			'description',
			'onClosePopup',
			'showPopup'
		],
		data: function() {
			return {
				comments: [],
				form: {
					username: "",
					comment: "",
					imageId: ""
				}
			};
		}, // closes data
		mounted: function() {
			var self = this;
			// here we'll make axios requests to get data from the server that we need to the render on screen
			axios.get('/comments/' + self.imageId).then(function(resp) {
				//			console.log('GET/cities', resp.data);
				//			console.log('self: ' , self);
				self.comments = resp.data;
				console.log('self.images:', self.comments);
			});
		}, //close mounted
		methods: {
			submitComment: function(imageId) {
				var self = this;
				// console.log('upload file');
				var formData = new FormData();
				formData.append('username', this.form.username);
				formData.append('comment', this.form.comment)
				this.form.imageId = imageId;
				// if you console.log formData and get an{} thats ok
				axios.post('/addcomment', formData)
					.then(function(resp) {
						console.log('resp in POST /addcomment', resp);
						 self.comments.push(resp.data);
					})
			}
		}

		,
		template: '#popup-template'
	})
})();
