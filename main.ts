namespace GP2Y1051 {

    let init = false

    //% blockId="setSerial" block="set Sharp GP2Y1051 to %pin"
    //% weight=100 blockGap=20 blockInlineInputs=true
    export function setSerial(pin: SerialPin): void {
        basic.pause(300)
        serial.redirect(
            SerialPin.USB_TX,
            pin,
            BaudRate.BaudRate9600
        )
        init = true
    }


    //% blockId="getData" block="the data of PM2.5 (μg/m³)"
    //% weight=90 blockGap=20 blockInlineInputs=true
    export function getData(): number {
        if (!inited) {
            // 未初始化就返回 0
            return 0
        }

        // 1) 等待头字节 0xA5
        let h = 0
        do {
            h = serial.readBuffer(1)
                      .getNumber(NumberFormat.UInt8BE, 0)
        } while (h !== 0xA5)

        // 2) 读 DATAH, DATAL, SUM
        let buf = serial.readBuffer(3)
        let dataH = buf.getNumber(NumberFormat.UInt8BE, 0) & 0x7F
        let dataL = buf.getNumber(NumberFormat.UInt8BE, 1) & 0x7F
        let sum   = buf.getNumber(NumberFormat.UInt8BE, 2) & 0x7F

        // 3) 校验和：低 7 位
        if ( ((0xA5 + dataH + dataL) & 0x7F) !== sum ) {
            // 校验失败
            return 0
        }

        // 4) 计算浓度返回
        return dataH * 128 + dataL
    }
}
