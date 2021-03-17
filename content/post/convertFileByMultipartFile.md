+++
title = "MultipartFile转换成File"
date = "2021-03-17"
tags = ["java"]
+++

# MultipartFile转换成File

```
    public static File convertFileByMultipartFile(MultipartFile file) {
        File toFile = null;
        if (file.equals("") || file.getSize() <= 0) {
            file = null;
        } else {
            InputStream ins = null;
            try {
                ins = file.getInputStream();
            toFile = new File(file.getOriginalFilename());
            inputStreamToFile(ins, toFile);
            ins.close();
            } catch (IOException e) {
                log.info("convertFileByMultipartFile error file name==>{}",file.getName());
                e.printStackTrace();
            }
        }
        return toFile;

    }

    //获取流文件
    private static void inputStreamToFile(InputStream ins, File file) {
        try {
            OutputStream os = new FileOutputStream(file);
            int bytesRead = 0;
            byte[] buffer = new byte[8192];
            while ((bytesRead = ins.read(buffer, 0, 8192)) != -1) {
                os.write(buffer, 0, bytesRead);
            }
            os.close();
            ins.close();
        } catch (Exception e) {
            log.info("inputStreamToFile error file name==>{}",file.getName());
            e.printStackTrace();
        }
    }
```