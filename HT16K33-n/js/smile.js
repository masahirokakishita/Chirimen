var smile_bmp =
  [ 0b00111100,
    0b01000010,
    0b10100101,
    0b10000001,
    0b10100101,
    0b10011001,
    0b01000010,
    0b00111100 ];

var neutral_bmp =
  [ 0b00111100,
    0b01000010,
    0b10100101,
    0b10000001,
    0b10111101,
    0b10000001,
    0b01000010,
    0b00111100 ];

var frown_bmp =
  [ 0b00111100,
    0b01000010,
    0b10100101,
    0b10000001,
    0b10011001,
    0b10100101,
    0b01000010,
    0b00111100 ];

function smileon()
{
	var i;
	for(i=0; i<16; i++){
		writeValue(i,0x00);
	}

	for(i=0; i<8; i++){
		writeValue(i*2,smile_bmp[i]);
	}
}

function neutralon()
{
	var i;
	for(i=0; i<16; i++){
		writeValue(i,0x00);
	}

	for(i=0; i<8; i++){
		writeValue(i*2+1,neutral_bmp[i]);
	}
}
function frownon()
{
	var i;
	for(i=0; i<16; i++){
		writeValue(i,0x00);
	}

	for(i=0; i<8; i++){
		writeValue(i*2,frown_bmp[i]);
		writeValue(i*2+1,frown_bmp[i]);
	}
}
		
