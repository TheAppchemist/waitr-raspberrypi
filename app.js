const dgram = require('dgram')
const express = require('express')
const app = express()
const server = dgram.createSocket('udp4')

const escpos = require('escpos');

const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
const printer = new escpos.Printer(device);

function print(printInstructions) {
	

device.open(function(err) {
	printInstructions.forEach(instruction => {
		console.log(instruction.method)
		console.log(print[instruction.method])
		printer[instruction.method](...instruction.params)

	})
	
	setTimeout(() => {
		printer.cut();
		printer.close();
	}, 1000)

});
}

server.bind(() => {
	server.setBroadcast(true);
	setInterval(() => {
		const message = 'waitr-hardware'
		server.send(message, 0, message.length, 3001, '255.255.255.255', null, err => {
			if (err) {
				console.log('Could not send packet')
			} else
			{
				console.log('Packet sent')
			}
		})
	}, 3000)
	console.log('Server started')
})

app.use(express.json())
app.post('/print', (req, res) => {
	if (req.body.instructions) {
		print(req.body.instructions)
	}
	return res.send({body: req.body, success: true})
})

app.listen(3002, () => {
	console.log('Listening on port 3002')
})
