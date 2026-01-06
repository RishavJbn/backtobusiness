import excelJS from excelJS;

const exportTasksReport = async (req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({mesage:"Error while exporting Tasks", error: error.mesage})
    }
}


const exportUsersReport = async (req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).json({mesage:"Error while exporting user Tasks", error: error.mesage})
    }
}

export {exportTasksReport,exportUsersReport};