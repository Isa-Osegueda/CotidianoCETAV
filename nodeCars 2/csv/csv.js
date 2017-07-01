const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

module.exports = {
	create,
	add,
	remove,
	merge
};


function create(archive, data){
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


function add(archive, data){

	let event = new EventEmitter();
	let newCsv = '';
	data.forEach((content) => {
		newCsv += content.name + ' ' + content.lastname + '\n';
	});


	fs.appendFile(archive, newCsv, error => {
		if(error) event.emit('error', error);
		return event;
	});


	return event;

}


function remove(archive){
	let event = new EventEmitter();


	fs.unlink(archive, error => {
		if(error) event.emit('error', error);
		event.emit('removed', archive);
	});

	return event;
}


function merge(archive1, archive2, archive3){

	let event = new EventEmitter();

	if(!fs.existsSync(archive1)){
		event.emit('error', new Error('archive '+archive1+' does not exists'));
		return event;
	};	


	if(!fs.existsSync(archive2)){
		event.emit('error', new Error('archive '+archive2+' does not exists'));
		return event;
	};	

	if(fs.existsSync(archive3)){
		event.emit('error', new Error('archive already exists: '+archive3));
		return event;
	};	

	fs.readFile(archive1, 'utf-8', (error, content) => {
		if(error) event.emit('error', error);
		let csv = content;

		
		fs.readFile(archive2, 'utf-8', (error, content) => {
			if(error) event.emit('error', error);
			csv += content;

			fs.writeFile(archive3, csv, error => {
				if(error) event.emit('error', error);
				event.emit('merged');
			});
		})
	});

	return event;
}

