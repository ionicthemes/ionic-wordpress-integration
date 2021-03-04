Let's build an Ionic app for your Wordpress site using Wordpress REST API! This ionic tutorial will show you how to communicate with the WP API in order to get your Wordpress posts, categories, comments. We also added Wordpress Login using JWT .This ionic tutorial includes a working example you can reuse for your needs!


**Please support this project by simply putting a Github star ⭐. Share this library with friends on Twitter and everywhere else you can. 🙏**

Check the complete step by step tutorial in: https://ionicthemes.com/tutorials/about/ionic-wordpress-integration

![](https://s3-us-west-2.amazonaws.com/ionicthemes/tutorials/screenshots/ionic-wordpress-integration/1.jpg)
![](https://s3-us-west-2.amazonaws.com/ionicthemes/tutorials/screenshots/ionic-wordpress-integration/2.jpg)
![](https://s3-us-west-2.amazonaws.com/ionicthemes/tutorials/screenshots/ionic-wordpress-integration/3.jpg)
![](https://s3-us-west-2.amazonaws.com/ionicthemes/tutorials/screenshots/ionic-wordpress-integration/4.jpg)

## Installation

Install  dependencies
```sh
npm install
```

## Wordpress Configuration

The REST API is included in the Wordpress Core from WordPress 4.7! Plugins are no longer required, just install the latest version of WordPress and you're ready to go.
In order to check that you are able to make requests to the REST API you only need to make a request to the following url: http://YOUR-WORDPRESS-SITE/wp-json/wp/v2/
Please note that you need to change 'YOUR-WORDPRESS-SITE' with your own value.


## Run the app on the browser

```sh
ionic serve
```

## Run the app on your phone

```sh
ionic cordova platform add android
ionic cordova run android
```

or

```sh
ionic cordova platform add ios
ionic cordova run ios
```
