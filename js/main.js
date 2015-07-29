/** @jsx React.DOM */

var Picture = React.createClass({
	//component does not hold any state, it jsut transforms whatwver its passee as atributes into HTML that represents a picture
	clickHandler: function() {
		//called when the component is clicked
		console.log(this.props);
		this.props.onClick(this.props.pic);
	},
	render: function() {
		var pictureClass = 'picture ' + (this.props.favorite ? 'favorite' : '');
		return (
			<div className={pictureClass} onClick={this.clickHandler} >
				<img src={this.props.src} width='200' title={this.props.title} />
			</div>
		);
	}
});

var PictureList = React.createClass({
	getInitialState: function() {
		return {
			//pictres array will be populated throught ajax instagram requests and the favorites wuth click handlres on the images
			pictures: [],
			favorites: []
		};
	},
	componentDidMount: function() {
		//this occurs when component loads
		// var self = this; <------------- this is to remember scoping of this, by using binding we get same results and cleaner code!

		//the url can be changed to other instagram endpoints, depending on what you want
		var url = 'https://api.instagram.com/v1/tags/' + this.props.tag + '/media/recent?client_id=' + this.props.apiKey + '&callback=?';
		console.log(url);

		$.getJSON(url, function(result) {
			if(!result || !result.data || !result.data.length) {
				return;
			}
			var pictures = result.data.map(function(e) {
				return {
					id: e.id,
					url: e.link,
					src: e.images.low_resolution.url,
					title: e.caption ? e.caption.text : '',
					favorite: false
				};
			});

			//here we must update the component, which will cause a render
			this.setState({
				pictures: pictures
			});
		}.bind(this));
	},
	pictureClick: function(id) {
		var favorites = this.state.favorites,
		pictures = this.state.pictures;

		for(var i = 0; i < pictures.length; i++) {
			if(pictures[i].id === id) {
				if(pictures[i].favorite) {
					return this.favoriteClick(id);
				}
				favorites.push(pictures[i]);
				pictures[i].favorite = true;

				break;
			}
		}

		this.setState ({
			pictures: pictures,
			favorites: favorites
		});
	},
	favoriteClick: function(id) {
		var favorites = this.state.favorites,
		pictures = this.state.pictures;

		for(var i = 0; i < pictures.length; i++) {
			if(favorites[i].id === id) {
				break;
			}
		}

		//remove the from the favorites array!
		favorites.splice(i, 1);

		for(i = 0; i < pictures.length; i++) {
			if(pictures[i].id === id) {
				pictures[i].favorite = false;
				break;
			}
		}

		//update the state and trigger a render
		this.setState({
			pictures: pictures,
			favorites: favorites
		});
	},
	render: function() {
		// var self = this;
		var pictures = this.state.pictures.map(function(e) {
			return <Picture pic={e.id} src={e.src} title={e.title} favorite={e.favorite} onClick={this.pictureClick} key={e.id} />
		}.bind(this));
		if(!pictures.length) {
			pictures = <p> Loading Images ... </p>;
		}
		var favorites= this.state.favorites.map(function(e) {
			return <Picture pic={e.id} src={e.src} title={e.title} favorite={true} onClick={this.pictureClick} key={e.id} />
		}.bind(this));
		if(!favorites.length) {
			favorites = <p> Click on an image to mark as favorite! </p>;
		}
		return (
			<div>
				<h1>Popular Instageam Pics</h1>
				<div className="pictures"> {pictures} </div>

				<h1>Favorites</h1>
				<div className="favorites"> {favorites} </div>
			</div>
		);
	}
});

React.render(
	<PictureList apiKey="4680f1d6832f41cb99bd08d7283cb065" tag="adcade" />,
	document.body
);

