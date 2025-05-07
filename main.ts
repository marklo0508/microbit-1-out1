basic.showIcon(IconNames.Happy)
GP2Y1051.setSerial(SerialPin.P13)
basic.forever(function () {
    basic.showNumber(GP2Y1051.getData())
})
