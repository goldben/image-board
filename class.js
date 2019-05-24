//script.js
(function() {

Vue.component('cute-animal-modal', {
	//option2 in index.html
	//<script id="dogs-template" type='text/x-template'>
	template: '#dogs-template

	/* option 1
	<div class="cute-animal-container">
	<h1>this is bla</h1>
	</div>
	*/
	',
	props: ['name', 'cuteAnimals'], //what we need from the parent (Vue instance)
	data: function() {
		return{
				name: 'Layla'
		}
	}

	//in html {{name}}
});//closes vue component


})
