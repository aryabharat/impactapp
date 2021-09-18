const csv = require('fast-csv');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function uploadStudentCSV(req,res,nex){
    try{
        console.log("aaa")
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }
        let data = await readFile(req.files.files.tempFilePath)

      await  prisma.student.createMany({data})
      return res.send({msg:"user created", status:200})

    }catch(err){
        console.log(err);
        res.send({msg:err.message, status:400})
    }
}
async function getStudentResult(req,res,nex){
    try{
        const {id} = req.params;
        console.log(id)
      const stu =   await prisma.student.findUnique({where:{id}});
      if(stu === null)
        return res.send({msg:"no student with this id", status:200})
      res.send({msg:stu, status:200})
    }catch(err){
        console.log(err);
        res.send({msg:err.message, status:400})
    }
}
async function getStudent(req,res,nex){
    try{
        let {resultStatus}= req.query;
        if(resultStatus === "passed")
        return  res.send({data:await prisma.$queryRaw`SELECT * FROM "Student" WHERE mark1+mark2+mark3>120`, status:200})

        if(resultStatus === "failed")
        return  res.send({data:await prisma.$queryRaw`SELECT * FROM "Student" WHERE mark1+mark2+mark3<120`, status:200})


        return  res.send({data:"invalid resultStatus", status:200})
         
    }catch(err){
        console.log(err);
        res.send({msg:err.message, status:400})
    }
}

//helper
async function readFile(filepath){
    console.log(filepath)
    return new Promise((res,rej)=>{
        let data = []
        var stream = fs.createReadStream(filepath);
        csv
        .parseStream(stream, {headers : true})
        .on("data", function(d){
            // d = [...data,...d]
            d.Age = parseInt(d.Age)
            d.mark1 = parseInt(d.mark1)
            d.mark2 = parseInt(d.mark2)
            d.mark3 = parseInt(d.mark3)
            data.push(d);
            //console.log('I am one line of data', data);
        })
        .on("end", function(){
            res(data);
        });
    })
}

module.exports = {uploadStudentCSV,getStudentResult,getStudent}