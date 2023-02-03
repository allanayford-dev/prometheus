const express = require('express');
const ServiceRegistry = require('./lib/ServiceRegistry');

const service = express();

module.exports = (config) => {
	const log = config.log();
	const serviceRegistry = new ServiceRegistry(log);

	if (service.get('env') === 'development') {
		service.use((req, res, next) => {
			log.debug(`${req.method}: ${req.url}`);
			return next();
		});
	}

	service.put(
		'/register/:servicename/:serviceversion/:serviceport',
		(req, res) => {
			const { servicename, serviceversion, serviceport } = req.params;

			const serviceip = req.connection.remoteAddress.includes('::')
				? `[${req.connection.remoteAddress}]`
				: req.connection.remoteAddress;

			const serviceKey = serviceRegistry.register(
				servicename,
				serviceversion,
				serviceip,
				serviceport
			);

			return res.json({ result: serviceKeygit });
		}
	);

	service.delete(
		'/register/:servicename/:serviceversion/:serviceport',
		(req, res, next) => {
			return next('Not Implemented');
		}
	);

	service.get('/register/:servicename/:serviceversion', (req, res, next) => {
		return next('Not Implemented');
	});

	service.use((error, req, res) => {
		res.status(error.status || 500);
		log.error(error);
		return res.json({
			error: {
				message: error.message,
			},
		});
	});

	return service;
};
