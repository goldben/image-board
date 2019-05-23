//all the vue code goes in this file
(function() {
		new Vue({
				//most vue code goes here
				el: '#main',
				data: {
					images: [],
					form: {
						title:'',
						description:'',
						username:'',
						file:'null'
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
				},//close mounted

				methods: {
					//every response to an event is defind here
					handleFileChange: function(e) {
							//console.log('handle change e:', e);
							//e.target.files[0];
							console.log("this: ",this)
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
					}
				}

			}); //closes Vue instance
		})();
