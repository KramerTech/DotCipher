let scale = 20;
let scaleX = 0.7 * scale;
let scaleY = scale;

let xOff = 18;
let yOff = scale * 1.5;

let textIn = document.getElementById("text")
textIn.focus();
textIn.value = "hey look it's your cipher";
textIn.addEventListener("input", () => draw(), false);
window.addEventListener("resize", () => draw());

let positions = [
	undefined, // 0 indicates no dot
	[0, 0], [0.5, 0], [1, 0],
	[0, 0.5], [0.5, 0.5], [1, 0.5],
	[0, 1], [0.5, 1], [1, 1],
];
positions.forEach(v => {
	if (v) {
		v[0] *= scaleX;
		v[1] *= scaleY;
	}
});

let alphabet = "abcdefgh ijklmnop qrstu vwxyz";
let letters = [
	// a - h
	1830, 1832, 3490, 3496, 7290, 7298, 1670, 1674,
	// i - p
	7930, 7935, 1790, 1795, 7130, 7135, 1390, 1395,
	// q - u
	190730, 190732, 190736, 190738, 190734,
	// v - z
	280460, 280461, 280463, 280469, 280467,
];

let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");

function draw() {
	let text = textIn.value || alphabet;

	canvas.height = Math.floor(window.innerHeight / 2);
	canvas.width = window.innerWidth;

	c.lineWidth = scale / 20;

	c.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	let x = xOff;
	let y = 10;

	let words = text.split(" ");
	let word = 0;

	for (let char of text.toLowerCase()) {
		if (char === " ") {
			x += scaleX;

			let wordLength = words[++word].length * scale;
			if (wordLength < canvas.width && x + wordLength >= canvas.width) {
				x = xOff;
				y += yOff;
			}

			continue;
		}

		if (x + scale >= canvas.width) {
			x = xOff;
			y += yOff;
		}

		let idx = +(char.charCodeAt(0) - "a".charCodeAt(0));
		if (idx < 0 || idx >= 26) {
			continue;
		}

		let code = letters[idx] + "";

		c.save();
		c.translate(x, y);
		c.beginPath();
		for (let i = 0; i < code.length; i++) {
			let pos = positions[+code[i]];
			if (i + 1 === code.length) {
				c.stroke();
				if (pos) {
					c.beginPath();
					let dx = (pos[0] - 0.5 * scaleX) / 3;
					let dy = (pos[1] - 0.5 * scaleY) / 3;
					c.arc(pos[0] - dx, pos[1] - dy, 2, 0, Math.PI * 2);
					c.fill();
				}
			} else if (!pos) {
				c.stroke();
				c.beginPath();
			} else {
				c.lineTo(pos[0], pos[1])
			}
		}

		c.restore();
		x += scale;
	}
}

draw();