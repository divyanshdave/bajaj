const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const response_obj = {
    "is_success": true,
    "user_id": process.env.NAME+"_"+process.env.DOB,
    "email" : process.env.EMAIL,
    "roll_number": process.env.ROLL_NUMBER,
    "numbers": [],
    "alphabets": [],
    "highest_lowercase_alphabet":[],
    "is_prime_found":false,
    "file_valid":false,
    "file_mime_type": "",
    "file_size_kb": "0"
}

const isPrime = (num)=>{
    if(num <= 1){
        return false;
    }

    if(num <= 3){
        return true;
    }

    if (num % 2 === 0 || num % 3 === 0){
        return false;
    }

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0){
            return false;
        }
    }

    return true;
}

const process_data = (data)=>{

    const reg = /^[A-Za-z]$/;
    const low_reg = /^[a-z]$/;

    const lower_case = [];

    data.forEach(e=>{
        if(!isNaN(e)){
            response_obj["numbers"].push(e);

            if(isPrime(parseInt(e))){
                response_obj["is_prime_found"] = true;
            }
        }
        if(reg.test(e)){
            response_obj["alphabets"].push(e);

            if(low_reg.test(e)){
                lower_case.push(e);
            }
        }
    }); 

    if(lower_case.length > 0){
        const i = lower_case.length-1;
        response_obj["highest_lowercase_alphabet"].push(lower_case.sort()[i]);
    }

}

const getFileSize = (file_b64)=>{
    // Remove the data URL part (e.g., "data:image/png;base64,")
    const base64Data = file_b64;
    
    // Calculate the size in bytes
    const base64Length = file_b64.length;
    const padding = (base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0);
    
    // Calculate the original size
    const originalSize = (base64Length * 3) / 4 - padding;
    
    return originalSize;
}

const process_b64 = (file_b64)=>{
    const b64_reg = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;


    //common signatures
    const signatures = {
        JVBERi0: "application/pdf",
        R0lGODdh: "image/gif",
        R0lGODlh: "image/gif",
        iVBORw0KGgo: "image/png",
        TU0AK: "image/tiff",
        "/9j/": "image/jpg",
        UEs: "application/vnd.openxmlformats-officedocument.",
        PK: "application/zip",
    };

    if(b64_reg.test(file_b64)){
        response_obj["file_valid"] = true;

        for(let s in signatures){
            if(file_b64.indexOf(s) === 0){
                let x = signatures[s];
                response_obj["file_mime_type"] = x;
            }
        }

        response_obj["file_size_kb"] = String(getFileSize(file_b64));
    }
}


router.get("/", (req, res)=>{
    res.send("Welcome to backend API");
});

router.get("/bfhl", (req, res)=>{
    res.status(200).json({"operation_code": 1});
});

router.post("/bfhl", (req, res)=>{
    const data = req.body.data;
    const file_b64 = req.body.file_b64;

    if(data && data.length > 0){
        process_data(data);
    }

    if(file_b64 !== undefined || file_64 != null){
        process_b64(file_b64);
    }

    res.json(response_obj);
});

module.exports = router;
