import React, { useEffect, useState } from "react";

import { ProgressBar } from "primereact/progressbar";
import { Task } from "../../models/task.model";
import { getTask } from "../../clients/v3/task.service";

type TaskBarProps = {
  task: Task;
  onComplete?: () => void;
};

export const TaskBar: React.FC<TaskBarProps> = ({ task, onComplete }) => {
  const [progress, setProgress] = useState<number>(task.progress);

  useEffect(() => {
    let timeout = 1000;
    let timeoutId: NodeJS.Timeout;

    const fetchTask = async () => {
      const updatedTask = await getTask(task.id);

      setProgress((prev) => {
        if (updatedTask.progress === prev) timeout += 1000;

        return updatedTask.progress;
      });

      if (updatedTask.complete) {
        onComplete?.();
        return;
      }

      timeoutId = setTimeout(fetchTask, timeout);
    };

    fetchTask();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [task, onComplete]);

  return <ProgressBar value={progress} color="#374785" />;
};
