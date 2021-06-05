const express = require('express');
var net = require('net');
const app = express();
const port = 3030;
app.listen(port, () => {
	console.log(
		`Example app listening at http://localhost:${port}`
	);
});

const multipart = require('connect-multiparty');
const cloudinary = require('cloudinary');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const multipartMiddleware = multipart();

cloudinary.config({
	cloud_name: 'dsqjm743b',
	api_key: '996246899883523',
	api_secret: 'xCKEmAf_hDNaax7uZUPxzyUQQZ0',
});
cloudinary.image('image.jpg', {
	transformation: [
		{
			width: 1520,
			height: 1440,
			gravity: 'west',
			x: 50,
			crop: 'crop',
		},
		{ effect: 'pixelate_region:15', gravity: 'ocr_text' },
	],
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post(
	'/upload',
	multipartMiddleware,
	function (req, res) {
		cloudinary.v2.uploader.upload(
			req.files.image.path,
			{
				ocr: 'adv_ocr',
			},
			function (error, result) {
				if (result.info.ocr.adv_ocr.status === 'complete') {
					var t = result.info.ocr.adv_ocr.data[0].textAnnotations[0].description;
					res.json(result); 
					var s = require('net').Socket();
					s.connect(8080);
					s.write(t); 
					s.end();			
				}
			}
		);
	}
);
