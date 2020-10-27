const body = document.querySelector('body');
const form = document.querySelector('form');
const inputFields = document.querySelectorAll('.rgb-picker input');

const hexValue = document.querySelector('.hex-value');
const binaryValues = document.querySelectorAll('.binary-value');

const rgbInputMin = '0';
const rgbInputMax = '255';


inputFields.forEach((inputField) => {
    if (inputField.id.includes('alpha')) {
        inputField.setAttribute('value', '1.0');
        inputField.setAttribute('min', '0.0');
        inputField.setAttribute('max', '1.0');
        inputField.setAttribute('step', '0.01');
        inputField.setAttribute('minlength', '3');
        inputField.setAttribute('maxlength', '4');
        inputField.setAttribute('pattern', '([0][.][0-9])|([1][.][0])|([0][.][0][0-9])');
    } else {
        inputField.setAttribute('value', '60');
        inputField.setAttribute('min', rgbInputMin);
        inputField.setAttribute('max', rgbInputMax);
        inputField.setAttribute('minlength', '1');
        inputField.setAttribute('maxlength', '3');
    }
    inputField.required = true;
    inputField.addEventListener('input', inputListener);
});

function inputListener(e) {
    let targetColor = e.target.id;
    if (Number(rgbInputMin) <= Number(form[targetColor].value) && Number(form[targetColor].value) <= Number(rgbInputMax)) {
        let red = Number(form['red'].value);
        let green = Number(form['green'].value);
        let blue = Number(form['blue'].value);
        let alpha = Number(form['alpha'].value);
        body.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha})`;

        let redHex = convertFromRgb(red, green, blue, 16)[0];
        let greenHex = convertFromRgb(red, green, blue, 16)[1];
        let blueHex = convertFromRgb(red, green, blue, 16)[2];
        let redBinary = convertFromRgb(red, green, blue, 2)[0];
        let greenBinary = convertFromRgb(red, green, blue,2)[1];
        let blueBinary = convertFromRgb(red, green, blue,2)[2];

        hexValue.innerHTML = `HEX value: #${redHex}${greenHex}${blueHex}`;
        binaryValues.forEach((binaryValue) => {
            if (binaryValue.id.includes('red')) binaryValue.innerHTML = `Red: ${redBinary}`;
            else if (binaryValue.id.includes('green')) binaryValue.innerHTML = `Green: ${greenBinary}`;
            else if (binaryValue.id.includes('blue')) binaryValue.innerHTML = `Blue: ${blueBinary}`;
        });
    }
}

function convertFromRgb(redDecimal, greenDecimal, blueDecimal, base) {
    let redDigits = [];
    let greenDigits = [];
    let blueDigits = [];

    converter(redDecimal, base, redDigits);
    converter(greenDecimal, base, greenDigits);
    converter(blueDecimal, base, blueDigits);

    return [redDigits.join(''), greenDigits.join(''), blueDigits.join('')];


    function converter(colorDecimal, base, colorContainer) {
        let digit = colorDecimal % base;

        if (base === 16) prependHexDigits();
        else prependBinDigits();

        colorDecimal = Math.floor(colorDecimal / base);

        if (colorDecimal >= base) {
            converter(colorDecimal, base, colorContainer);
        } else {
            if (base === 16) prependHexDigits(true);
            else prependBinDigits(true);
            return;
        }

        function prependHexDigits(lastDigit=false) {
            let hexDigit;
            if (lastDigit) hexDigit = colorDecimal;
            else hexDigit = digit;

            if (hexDigit === 10) colorContainer.unshift('A');
            else if (hexDigit === 11) colorContainer.unshift('B');
            else if (hexDigit === 12) colorContainer.unshift('C');
            else if (hexDigit === 13) colorContainer.unshift('D');
            else if (hexDigit === 14) colorContainer.unshift('E');
            else if (hexDigit === 15) colorContainer.unshift('F');
            else colorContainer.unshift(String(hexDigit));
        }

        function prependBinDigits(lastDigit=false) {
            let binDigit;
            if (lastDigit) {
                if (colorDecimal !== 0) binDigit = colorDecimal;
                else binDigit = '';
            }
            else binDigit = digit;

            colorContainer.unshift(String(binDigit));
        }
    }
}
