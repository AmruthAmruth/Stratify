import { getDepartmentProjects } from '@/services/projects';
import React, { useEffect, useState } from 'react'

const ManagerProjects = () => {
 const [projects, setProjects] = useState<any>(null); 

    useEffect(()=>{
        getDepartmentProjects().then((data)=>{
            setProjects(data)
        })
    },[])
    
  return (
    <div>ManagerProjects</div>
  )
}

export default ManagerProjects