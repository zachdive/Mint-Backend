const router = require("express").Router();
const Project = require("../models/Item.model");


router.get("/projects", async (req, res) => {
    try{
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch(e){
        res.status(500).json({message: e.message});
    }
});

router.post("/projects", async (req, res) => {
    const {title, description, imageUrl} = req.body;

    if(!title || !description || !imageUrl){
        res.status(400).message({message: "missing fields"});
        return;
    }
    try {
        const response = await Project.create({title, description, imageUrl});
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.delete("/projects/:id", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({message: `Project with id ${req.params.id} was deleted.`});
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.get("/projects/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.status(200).json(project);
    } catch(e) {
        res.status(500).json({message: e.message});
    }

});

router.put("/projects/:id", async (req, res) => {
    const {title, description, imageUrl} = req.body;
    if(!title || !description || !imageUrl){
        res.status(400).message({message: "missing fields"});
        return;
    }
    try {
        const response = await Project.findByIdAndUpdate(req.params.id, {
            title,
            description,
            imageUrl,
            },
            {new: true}
        );
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

router.post("/upload", fileUpload.single("file"), (req, res) => {
    try {
        res.status(200).json({fileUrl: req.file.path});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
})

module.exports = router;