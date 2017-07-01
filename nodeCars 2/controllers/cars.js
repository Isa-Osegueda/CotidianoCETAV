const fs = require('fs');
const Car = require('../models/car');
const querystring = require('querystring');
const url = require('url');

const DEFAULT_DATA = {
	records: [],
	counter: 0,
	total: 0
};
const PATH = __dirname+'/../data/cars.json';

module.exports = {
	getAll,
	create,
	update,
	remove,
	options
};


function getAll(req, res){
	let data = '';
	try{
		data = require(PATH);
	}catch (err){ // empty json
		data = DEFAULT_DATA;
	}
	return _jsonResponse(res, data);
}


function create(req, res){
	let body = '';
	req.on('data', chuck => body += chuck);
	req.on('end', () => {
		let params = querystring.parse(body);
		let car = new Car(params);
		if(!car.valid()) return _errorResponse(res, 'Invalid car');
		
		let data = '';
		try{
			data = require(PATH);
		}catch (err){
			data = DEFAULT_DATA;
		}
		
		// update the data
		data.records.push(car);
		data.total = data.records.length;
		data.counter = data.records[data.records.length-1].id;
		
		// save the data
		fs.writeFile(PATH, JSON.stringify(data), err => {
			if(err) return _errorResponse(res, 'Could not save new car.');
			return _jsonResponse(res, data);
		});
	});
}

function csv(archive, data){
	let event = new EventEmitter();


	if(fs.existsSync(archive)){
		event.emit('error', new Error('File alreasy exists: '+archive));
		return event;
	}

	
	let csv = '';
	data.forEach((element) => {
		csv += element.name + ' ' + element.lastname + '\n';
	})

	fs.writeFile(archive, csv, error => {
		if(error) event.emit('error', error);
		event.emit('done', csv);
	});

	return event;
}



 //mantiene la nueva data
function update(req, res){
	console.log('update car');
	let body = '';
	
	req.on('data', chuck => body += chuck);
	req.on('end', () => {
		let params = querystring.parse(body);
		let car = new Car(params);
		if(!car.valid()) return _errorResponse(res, 'Invalid car');
		
		let idx = _findcar(params.id, true);
		

		console.log('idx', idx);
		if(idx === -1) return _errorResponse(res, 'Could not find the user to update.');
		
		let data = require(PATH);
		data.records[idx] = car;
		data.total = data.records.length;
		
		data = _toJson(data);
		fs.writeFile(PATH, data, err => {
			if(err) return _errorResponse(res, 'Could not update the user.');
			return _jsonResponse(res, data, false);
		})
		
	});
}


function remove(req, res){
	let data = '';
	try{
		data = require(PATH);
	}catch (err){
		return _errorResponse(res, 'No cars to delete.');
	}
	
	let body = '';
	req.on('data', chuck => body += chuck);
	req.on('end', () => {
		let params = querystring.parse(body);
		let idx = _findcar(params.id, true)
		
		if(idx === -1) return _errorResponse(res, 'Could not find the car to delete.');
		
		// remove the car
		data.records.splice(idx, 1);
		data.total = data.records.length;
		data = _toJson(data);
		fs.writeFile(PATH, data, err => {
			if(err) return _errorResponse(res, 'Could not delete user');
			return _jsonResponse(res, data, false);
		});
	});
}


function _findcar(id, getIdx = false){
	let data = '';
	let idx = -1;
	
	try{
		data = require(PATH);
	}catch (err){
		return getIdx ? idx : null;
	}
	
	// find the car to delete
	data.records.forEach((car, index) => {
		if(car.id === +id) idx = index;
	});
	
	if(getIdx) return idx;
	return data[idx];
}



function options(req, res){
	res.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
	});
	res.end();
}


function _toJson(data){
	try{
		data = JSON.stringify(data);
	}catch (err) {
		data = null;
	}
	return data;
}


 //Respuesta,maneja los errores
function _jsonResponse(res, data, toJson = true){
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	data = toJson ? _toJson(data) : data;
	res.write(data);
	return res.end();
}

function _errorResponse(res, message){
	res.writeHead(400, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*'
	});
	return res.end(_toJson({
		error: true,
		message
	}));
}