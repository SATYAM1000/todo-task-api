const express=require('express');
const mongoose=require('mongoose');
const env=require('dotenv');
env.config();
const shortid=require('shortid');
const app=express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/todo_db")
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

  //-----------------------schema ------------------------

  const toDoSchema=mongoose.Schema({
    task:{
        type:String,
        required:true,
        unique:true
    },
    taskid:{
        type:String,
        unique:true
    }
  })

  const todoTask=new mongoose.model('todoTask', toDoSchema);

//   --------------------------

app.post('/task', async (req, res) => {
    try {
      const newTask = req.body;
      const tid = shortid.generate();
      newTask.taskid = tid;
      const document = new todoTask(newTask);
      await document.save(); // Await the save operation
      res.status(200).json({ message: "Task added successfully." });
    } catch (error) {
      res.status(500).json({ message: "Task cannot be added!!" });
    }
  });
  

app.get('/task', async(req,res)=>{
    try{
        const tasks=await todoTask.find().select({_id:0, __v:0, taskid:0});
        const tasksArray=[]
        for(let i=0;i<tasks.length;i++){
            tasksArray.push(tasks[i].task)
        }
        res.status(200).json(tasksArray);
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"error in displaying data"})
    }
})

app.delete('/task/:id', async(req,res)=>{
    try{
        const tid=req.params.id;
        const tasks=await todoTask.deleteOne({taskid:tid});
        res.status(200).json({message:"Task deleted successfully.."})

    }
    catch(error){
        console.log(error);
        res.status(400).json({message:"error in displaying tasks"})

    }
})

app.patch('/task/:id', async(req,res)=>{
    try{
        const ntask=req.params.id;
        await todoTask.updateOne({taskid:ntask}, {$set:{task:req.body.task}})
        res.status(200).json({ message: "Task updated successfully." });
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:" Error in updating task"})

    }
    
})





app.listen(4000, ()=>{
    console.log("server is working")
})