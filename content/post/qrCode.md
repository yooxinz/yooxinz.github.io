+++
title = "二维码生成与解析"
date = "2021-03-17"
tags = ["java"]
+++

# pom.xml

```
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.3.3</version>
    <scope>compile</scope>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.3.3</version>
    <scope>compile</scope>
</dependency>
```
# 二维码生成

```
    private static final int QRCOLOR = 0xFF000000;   //默认是黑色
    private static final int BGWHITE = 0xFFFFFFFF;   //背景颜色

    /**
    * 生成二维码图片String
    *
    * @param url  链接
    * @return
    */
    public static String getQrCode(String url) {
        try {
            ZXingCodeUtil zp = new ZXingCodeUtil();
            BufferedImage bim = zp.getQR_CODEBufferedImage(url, BarcodeFormat.QR_CODE, 300, 300, zp.getDecodeHintType());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            baos.flush();
            ImageIO.write(bim, "png", baos);
            BASE64Encoder encoder = new BASE64Encoder();

            baos.close();
            return encoder.encode(baos.toByteArray());
        } catch (Exception e) {
            log.info("getQrCode error url==>{}",url);
            log.info(e.getMessage());
        }
        return null;
    }

    /**
     * 生成二维码bufferedImage图片
     *
     * @param content       编码内容
     * @param barcodeFormat 编码类型
     * @param width         图片宽度
     * @param height        图片高度
     * @param hints         设置参数
     * @return
     */
    public BufferedImage getQR_CODEBufferedImage(String content, BarcodeFormat barcodeFormat, int width, int height, Map<EncodeHintType, ?> hints) {
        MultiFormatWriter multiFormatWriter = null;
        BitMatrix bm = null;
        BufferedImage image = null;
        try {
            multiFormatWriter = new MultiFormatWriter();
            // 参数顺序分别为：编码内容，编码类型，生成图片宽度，生成图片高度，设置参数
            bm = multiFormatWriter.encode(content, barcodeFormat, width, height, hints);
            int w = bm.getWidth();
            int h = bm.getHeight();
            image = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);

            // 开始利用二维码数据创建Bitmap图片，分别设为黑（0xFFFFFFFF）白（0xFF000000）两色
            for (int x = 0; x < w; x++) {
                for (int y = 0; y < h; y++) {
                    image.setRGB(x, y, bm.get(x, y) ? QRCOLOR : BGWHITE);
                }
            }
        } catch (WriterException e) {
        	log.info(e.getMessage());
        }
        return image;
    }

    /**
     * 设置二维码的格式参数
     *
     * @return
     */
    public Map<EncodeHintType, Object> getDecodeHintType() {
        // 用于设置QR二维码参数
        Map<EncodeHintType, Object> hints = new HashMap<EncodeHintType, Object>();
        // 设置QR二维码的纠错级别（H为最高级别）具体级别信息
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        // 设置编码方式
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        hints.put(EncodeHintType.MARGIN, 0);
        hints.put(EncodeHintType.MAX_SIZE, 350);
        hints.put(EncodeHintType.MIN_SIZE, 100);

        return hints;
    }
```

# 二维码解析

```
    private static final String CHARSET = "utf-8";
    /**
     * 解析二维码图片中的链接
     *
     * @param file 二维码图片
     */
    public static String decode(File file) {
        try {
            BufferedImage image;
            image = ImageIO.read(file);
            if (image == null) {
                return null;
            }
            BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            Result result;
            Hashtable hints = new Hashtable();
            hints.put(DecodeHintType.CHARACTER_SET, CHARSET);
            result = new MultiFormatReader().decode(bitmap, hints);
            String resultStr = result.getText();
            return resultStr;
        } catch (Exception e){
            log.info("decode error file name==>{}",file.getName());
            log.info(e.getMessage());
        }
        return null;
    }
```