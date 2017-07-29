'use strict';

var I2C 	= null;		 // global I2CAccess object
var ports	= null;
var port 	= null;		 // global I2CPort object
var slaveDevice = null;

var m_gain	= 0;
var m_bitShift;
var m_conversionDelay;
var m_fVal=0;
var m_flag=0;
var	m_start=0;
var m_channel=0;

/*=========================================================================
    I2C ADDRESS/BITS
    -----------------------------------------------------------------------*/
const ADS1015_ADDRESS               =  (0x48)    // 1001 000 (ADDR = GND)
/*=========================================================================*/

/*=========================================================================
    CONVERSION DELAY (in mS)
    -----------------------------------------------------------------------*/
const ADS1015_CONVERSIONDELAY       =  (1)
const ADS1115_CONVERSIONDELAY       =  (8)
/*=========================================================================*/

/*=========================================================================
    POINTER REGISTER
    -----------------------------------------------------------------------*/
const ADS1015_REG_POINTER_MASK       =  (0x03)
const ADS1015_REG_POINTER_CONVERT    =  (0x00)
const ADS1015_REG_POINTER_CONFIG     =  (0x01)
const ADS1015_REG_POINTER_LOWTHRESH  =  (0x02)
const ADS1015_REG_POINTER_HITHRESH   =  (0x03)
/*=========================================================================*/

/*=========================================================================
    CONFIG REGISTER
    -----------------------------------------------------------------------*/
const ADS1015_REG_CONFIG_OS_MASK     =  (0x8000)
const ADS1015_REG_CONFIG_OS_SINGLE   =  (0x8000)  // Write: Set to start a single-conversion
const ADS1015_REG_CONFIG_OS_BUSY     =  (0x0000)  // Read: Bit = 0 when conversion is in progress
const ADS1015_REG_CONFIG_OS_NOTBUSY  =  (0x8000)  // Read: Bit = 1 when device is not performing a conversion

const ADS1015_REG_CONFIG_MUX_MASK    =  (0x7000)
const ADS1015_REG_CONFIG_MUX_DIFF_0_1=  (0x0000)  // Differential P = AIN0, N = AIN1 (default)
const ADS1015_REG_CONFIG_MUX_DIFF_0_3=  (0x1000)  // Differential P = AIN0, N = AIN3
const ADS1015_REG_CONFIG_MUX_DIFF_1_3=  (0x2000)  // Differential P = AIN1, N = AIN3
const ADS1015_REG_CONFIG_MUX_DIFF_2_3=  (0x3000)  // Differential P = AIN2, N = AIN3
const ADS1015_REG_CONFIG_MUX_SINGLE_0=  (0x4000)  // Single-ended AIN0
const ADS1015_REG_CONFIG_MUX_SINGLE_1=  (0x5000)  // Single-ended AIN1
const ADS1015_REG_CONFIG_MUX_SINGLE_2=  (0x6000)  // Single-ended AIN2
const ADS1015_REG_CONFIG_MUX_SINGLE_3=  (0x7000)  // Single-ended AIN3

const ADS1015_REG_CONFIG_PGA_MASK    =  (0x0E00)
const ADS1015_REG_CONFIG_PGA_6_144V  =  (0x0000)  // +/-6.144V range = Gain 2/3
const ADS1015_REG_CONFIG_PGA_4_096V  =  (0x0200)  // +/-4.096V range = Gain 1
const ADS1015_REG_CONFIG_PGA_2_048V  =  (0x0400)  // +/-2.048V range = Gain 2 (default)
const ADS1015_REG_CONFIG_PGA_1_024V  =  (0x0600)  // +/-1.024V range = Gain 4
const ADS1015_REG_CONFIG_PGA_0_512V  =  (0x0800)  // +/-0.512V range = Gain 8
const ADS1015_REG_CONFIG_PGA_0_256V  =  (0x0A00)  // +/-0.256V range = Gain 16

const ADS1015_REG_CONFIG_MODE_MASK   =  (0x0100)
const ADS1015_REG_CONFIG_MODE_CONTIN =  (0x0000)  // Continuous conversion mode
const ADS1015_REG_CONFIG_MODE_SINGLE =  (0x0100)  // Power-down single-shot mode (default)

const ADS1015_REG_CONFIG_DR_MASK     =  (0x00E0)  
const ADS1015_REG_CONFIG_DR_128SPS   =  (0x0000)  // 128 samples per second
const ADS1015_REG_CONFIG_DR_250SPS   =  (0x0020)  // 250 samples per second
const ADS1015_REG_CONFIG_DR_490SPS   =  (0x0040)  // 490 samples per second
const ADS1015_REG_CONFIG_DR_920SPS   =  (0x0060)  // 920 samples per second
const ADS1015_REG_CONFIG_DR_1600SPS  =  (0x0080)  // 1600 samples per second (default)
const ADS1015_REG_CONFIG_DR_2400SPS  =  (0x00A0)  // 2400 samples per second
const ADS1015_REG_CONFIG_DR_3300SPS  =  (0x00C0)  // 3300 samples per second

const ADS1015_REG_CONFIG_CMODE_MASK  =  (0x0010)
const ADS1015_REG_CONFIG_CMODE_TRAD  =  (0x0000)  // Traditional comparator with hysteresis (default)
const ADS1015_REG_CONFIG_CMODE_WINDOW=  (0x0010)  // Window comparator

const ADS1015_REG_CONFIG_CPOL_MASK   =  (0x0008)
const ADS1015_REG_CONFIG_CPOL_ACTVLOW=  (0x0000)  // ALERT/RDY pin is low when active (default)
const ADS1015_REG_CONFIG_CPOL_ACTVHI =  (0x0008)  // ALERT/RDY pin is high when active

const ADS1015_REG_CONFIG_CLAT_MASK   =  (0x0004)  // Determines if ALERT/RDY pin latches once asserted
const ADS1015_REG_CONFIG_CLAT_NONLAT =  (0x0000)  // Non-latching comparator (default)
const ADS1015_REG_CONFIG_CLAT_LATCH  =  (0x0004)  // Latching comparator

const ADS1015_REG_CONFIG_CQUE_MASK   =  (0x0003)
const ADS1015_REG_CONFIG_CQUE_1CONV  =  (0x0000)  // Assert ALERT/RDY after one conversions
const ADS1015_REG_CONFIG_CQUE_2CONV  =  (0x0001)  // Assert ALERT/RDY after two conversions
const ADS1015_REG_CONFIG_CQUE_4CONV  =  (0x0002)  // Assert ALERT/RDY after four conversions
const ADS1015_REG_CONFIG_CQUE_NONE   =  (0x0003)  // Disable the comparator and put ALERT/RDY in high state (default)

const GAIN_TWOTHIRDS    = ADS1015_REG_CONFIG_PGA_6_144V;
const GAIN_ONE          = ADS1015_REG_CONFIG_PGA_4_096V;
const GAIN_TWO          = ADS1015_REG_CONFIG_PGA_2_048V;
const GAIN_FOUR         = ADS1015_REG_CONFIG_PGA_1_024V;
const GAIN_EIGHT        = ADS1015_REG_CONFIG_PGA_0_512V;
const GAIN_SIXTEEN      = ADS1015_REG_CONFIG_PGA_0_256V;


/*=========================================================================*/

// Initialize


window.addEventListener('load', function (){

	var head = document.querySelector('#head');
	m_conversionDelay = ADS1015_CONVERSIONDELAY;
	m_bitShift = 4;
	m_gain = GAIN_TWOTHIRDS; /* +/- 6.144V range (limited to VDD +0.3V max!) */

	navigator.requestI2CAccess().then(
		function(I2CAccess) {
			console.log("I2C ready!");
			I2C = I2CAccess;		// store in the global
			ports = I2C.ports;		// get a I2CPortMap object
			port = ports.get(0);

		// show the detailed information for each port
			console.log("* Port " + port.portNumber);
			console.log("  - Port name   : " + port.portName);
			console.log("  - PIN name    : " + port.pinName);
			
		// get the I2CPort object representing the I2C port named "I2C18".
			port.open(ADS1015_ADDRESS).then(
				function(I2CSlave) {
				slaveDevice = I2CSlave; // store slave Device in global

				setInterval(function(){
					if(m_flag==0){
						m_channel++;
						m_channel%=4;
						readADC_SingleEnded(m_channel);
					}else {
					}
				},10);
		
			},

			function(error) {
				console.log("Failed to get a I2C slave device: " + error.message);
			});
		},

		function(error) {
			console.log("Failed to get I2C access: " + error.message);
		}
	);
}, false);

//Writing a value
function writeValue(writeRegistar,v){
//	window.setTimeout(slaveDevice.write8(writeRegistar, v).then(writeSuccess, I2CError),2000);
	var rl=0x00FF&v;
	var rh=0xFF00&v;
	v=(rl<<8)+(rh>>8);
	slaveDevice.write16(writeRegistar, v).then(writeSuccess, I2CError);
}

function readValue(readRegistar){
	if(m_port!=null) m_port.write(0);
	slaveDevice.read16(readRegistar).then(readSuccess, I2CError);
}


// the value successfully written
function writeSuccess(value) {
	readValue(ADS1015_REG_POINTER_CONVERT);
}

// the value successfully read
function readSuccess(value) {
	if(m_port!=null) m_port.write(1);
	m_fVal = value;
	var rl=0x00FF&m_fVal;
	var rh=0xFF00&m_fVal;
	m_fVal=(rl<<8)+(rh>>8);
	m_fVal>>=m_bitShift;
	process(m_fVal,m_channel);
	m_flag=0;
}

// Show an error
function I2CError(error) {
	console.log("Error: " + error.message + "(" + slaveDevice.address + ")");
}

/**************************************************************************/
/*!
    @brief  Gets a single-ended ADC reading from the specified channel
*/
/**************************************************************************/
function readADC_SingleEnded(channel) {

  if (channel > 3)
  {
    return 0;
  }

	if(m_flag!=0){
		console.log("flag=!=0");
		return;
	}

  // Start with default values
  // Start with default values
 var config = ADS1015_REG_CONFIG_CQUE_NONE    | // Disable the comparator (default val)
                    ADS1015_REG_CONFIG_CLAT_NONLAT  | // Non-latching (default val)
                    ADS1015_REG_CONFIG_CPOL_ACTVLOW | // Alert/Rdy active low   (default val)
                    ADS1015_REG_CONFIG_CMODE_TRAD   | // Traditional comparator (default val)
                    ADS1015_REG_CONFIG_DR_1600SPS   | // 1600 samples per second (default)
                    ADS1015_REG_CONFIG_MODE_SINGLE;   // Single-shot mode (default)

  // Set PGA/voltage range
	config |= m_gain;

  // Set single-ended input channel
  switch (channel)
  {
    case (0):
      config |= ADS1015_REG_CONFIG_MUX_SINGLE_0;
      break;
    case (1):
      config |= ADS1015_REG_CONFIG_MUX_SINGLE_1;
      break;
    case (2):
      config |= ADS1015_REG_CONFIG_MUX_SINGLE_2;
      break;
    case (3):
      config |= ADS1015_REG_CONFIG_MUX_SINGLE_3;
      break;
  }

	// Set 'start single-conversion' bit
	config |= ADS1015_REG_CONFIG_OS_SINGLE;

	// Write config register to the ADC
	m_flag=1;
	writeValue(ADS1015_REG_POINTER_CONFIG, config);

//	readValue(ADS1015_REG_POINTER_CONVERT);

}
