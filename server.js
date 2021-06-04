const express = require('express');
const app = express();
const port = 3000;
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
	cloud_name: 'aurelion',
	api_key: '383495862575111',
	api_secret: 'bcIg-NrO_qHRkPi5uZNvGODi84I',
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
					res.json(result); // result.info.ocr.adv_ocr.data[0].textAnnotations[0].description (more specific)
				}
			}
		);
	}
);
