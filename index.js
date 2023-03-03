const http = require('http');
const https = require('https');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer();

http.createServer(function (req, res) {
	// Verifica si la URL incluye el prefijo "/https://" o "/http://"
	if (req.url.indexOf('/https://') === 0) {
		// Elimina el prefijo "/https://" de la URL
		const targetUrl = req.url.substring('/https://'.length);

		// Añade los headers necesarios para saltar el CORS
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONS'
		);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

		// Procesa la solicitud utilizando el proxy HTTP o HTTPS, según corresponda
		if (targetUrl.indexOf('https://') === 0) {
			// Si la URL de destino comienza con "https://", utiliza el módulo https
			https
				.request(targetUrl, function (targetRes) {
					res.writeHead(targetRes.statusCode, targetRes.headers);
					targetRes.pipe(res);
				})
				.end();
		} else {
			// Si la URL de destino comienza con "http://", utiliza el módulo http
			proxy.web(req, res, { target: targetUrl });
		}
	} else if (req.url.indexOf('/http://') === 0) {
		// Elimina el prefijo "/http://" de la URL
		const targetUrl = req.url.substring('/http://'.length);

		// Añade los headers necesarios para saltar el CORS
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, DELETE, OPTIONS'
		);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

		// Procesa la solicitud utilizando el proxy HTTP
		proxy.web(req, res, { target: targetUrl });
	} else {
		// Si la URL no incluye el prefijo "/https://" ni "/http://", devuelve un error
		res.statusCode = 400;
		res.end('La URL debe incluir el prefijo "/https://" o "/http://"');
	}
}).listen(3000);

console.log('El servidor proxy está corriendo en el puerto 3000');
