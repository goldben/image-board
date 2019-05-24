//all the vue code goes in this file
(function() {
	new Vue({
		//most vue code goes here
		el: '#main',
		data: {
			images: [],
			form: {
				title: '',
				description: '',
				username: '',
				file: 'null'
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
			// every single function that runs in response to an event will be written here.
			handleFileChange: function(e) {
				// file we want is: e.target.files[0]
				this.form.file = e.target.files[0];
			},

			uploadFile: function() {
				// because files are special, we have to treat them specially. We have to use an API called FormData to handle the file.
				var formData = new FormData();
				formData.append('file', this.form.file);
				formData.append('title', this.form.title);
				formData.append('username', this.form.username);
				formData.append('description', this.form.description);
				// if you log formData and get an {}, that's ok!
				var self = this;
				axios.post('/upload', formData)
					.then(function(resp) {
						console.log('resp in POST /upload', resp.data);
						self.images.unshift(resp.data);
					})

			}

		} // close methods

	}) // closes Vue instance







})();
