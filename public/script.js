// script.js is where ALL of our Vue code will go!

(function() {

    // this component is the modal that will popup.
    Vue.component('cute-animal-modal', {
        template: '#cute-animal-template',
        props: [ 'name', 'animalThatWasClicked' ],
        data: function() {
            return {
                animalName: 'Layla'
            }
        },
        mounted: function() {
            console.log('this in mounted of Vue component: ', this);
            // this.animalThatWasClicked
                // axios.get('/get-animal-info', {
                //     animalThatWasClicked: this.animalThatWasClicked
                // })
                axios.get('/get-animal-info/' + this.animalThatWasClicked);
        } // closes mounted
    }); // closes Vue component

    // Vue components ONLY have access to their own "data".
    // Vue components DO NOT have access to the data of their parents (Vue instance).



    new Vue({
        el: '#main',
        data: {
            // someCondition: false,
            animalThatWasClicked: '',
            name: 'ivana',
            cities: [],

            form: {
                title: '',
                description: '',
                username: '',
                file: null
            },



            cuteAnimals: [
                {
                    name: 'rabbit',
                    cutenessScore: 6
                },
                {
                    name: 'otter',
                    cutenessScore: 10
                },
                {
                    name: 'penguin',
                    cutenessScore: 3
                },
                {
                    name: 'dessert fox',
                    cutenessScore: 9
                },
                {
                    name: 'blobfish',
                    cutenessScore: 1
                },
                {
                    name: 'puppy',
                    cutenessScore: 1
                }
            ] // closes cuteAnimals array
        }, // closes data


        // mounted is something we call a "lifecycle" method
        mounted: function() {


            // here we're going to make AXIOS (so in other words, a GET request to our server) requests to get data from the server that we need to then render on screen

            // this refers to the Vue instance!
            var self = this;
            axios.get('/cities')
                .then(function(resp) {
                    // console.log('resp.data', resp.data);
                    // self.cities is the cities array in 'data'
                    // resp.data represents the cities array I got from the server
                    self.cities = resp.data;
                    // with this line of code, the cities array now lives in the "data" object of Vue

                    // console.log('self.cities: ', self.cities);
                    // self.cities refers to the cities array in "data"

                });
        }, // closes mounted

        methods: {

            toggleAnimalModal: function(animal) {
                this.animalThatWasClicked = animal;
                // this.someCondition = true;
            }, // <-- COMMMA

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

                axios.post('/upload', formData)
                    .then(function(resp) {
                        console.log('resp in POST /upload', resp);
                    })

            }

        } // close methods

    }) // closes Vue instance





// we will be using AXIOS, a JS library for making ajax requests, to make GET and POST requests to our server WITHOUT causing the page to reload.







})();
