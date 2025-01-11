 // Display current date
const currentDateElem = document.getElementById('current-date');
const currentDate = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
currentDateElem.textContent = currentDate.toLocaleDateString(undefined, options);

// Time blocks from 4:00 AM to 3:00 AM
const startHour = 4;
const endHour = 3; // 3:00 AM of the next day

// Emojis for tasks
const emojis = {
    reading: '📚',
    exercise: '🏋️',
    breakfast: '🍳',
    meeting: '💼',
    relax: '😌',
    work: '🖥️'
};

// Function to generate time blocks
function generateTimeBlocks() {
    const timeBlocksContainer = document.querySelector('.time-blocks');
    let hour = startHour;
    const sections = ['Morning (4 AM - 11 AM)', 'Afternoon (12 PM - 5 PM)', 'Night (6 PM - 3 AM)'];
    let currentSection = 0;

    sections.forEach((section, sectionIndex) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');
        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = section;
        sectionDiv.appendChild(sectionTitle);

        while (true) {
            const nextHour = (hour + 1) % 24;
            const timeBlock = document.createElement('div');
            timeBlock.classList.add('time-block');
            
            // Display time range (e.g., 7:00-8:00 AM)
            const timeLabel = document.createElement('span');
            const formattedHour = hour > 12 ? hour - 12 : hour;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const nextFormattedHour = nextHour > 12 ? nextHour - 12 : nextHour;
            const nextAmpm = nextHour >= 12 ? 'PM' : 'AM';
            
            timeLabel.textContent = `${formattedHour}:00 - ${nextFormattedHour}:00 ${ampm}`;
            
            // Timer
            const timer = document.createElement('span');
            timer.classList.add('timer');
            timer.textContent = `Time Block: ${formattedHour} - ${nextFormattedHour} ${ampm}`;
            
            // Input for adding tasks
            const taskInput = document.createElement('input');
            taskInput.type = 'text';
            taskInput.placeholder = 'Add a task...';
            taskInput.id = `task-${hour}`;

            // Button to save task
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save Task';
            saveButton.onclick = function() {
                saveTask(hour, taskInput.value);
            };

            // Task list
            const taskList = document.createElement('ul');
            taskList.classList.add('task-list');
            loadTasks(hour, taskList);

            timeBlock.appendChild(timeLabel);
            timeBlock.appendChild(timer);
            timeBlock.appendChild(taskInput);
            timeBlock.appendChild(saveButton);
            timeBlock.appendChild(taskList);

            sectionDiv.appendChild(timeBlock);

            // If we've reached 11:00 AM, 5:00 PM, or 3:00 AM, break out of the loop
            if ((sectionIndex === 0 && nextHour === 12) || 
                (sectionIndex === 1 && nextHour === 18) || 
                (sectionIndex === 2 && nextHour === endHour)) {
                break;
            }

            hour = nextHour;
        }

        timeBlocksContainer.appendChild(sectionDiv);
    });
}

// Save task to localStorage with numbering and emoji
function saveTask(hour, task) {
    if (task) {
        const taskList = document.getElementById(`task-list-${hour}`);
        const taskNumber = taskList.children.length + 1;
        const taskItem = document.createElement('li');
        const emoji = getEmoji(task);

        taskItem.textContent = `${taskNumber}. ${emoji} ${task}`;
        taskList.appendChild(taskItem);

        // Save task list in localStorage
        localStorage.setItem(`task-${hour}`, taskList.innerHTML);
    }
}

// Get emoji for task
function getEmoji(task) {
    if (task.includes('read')) return emojis.reading;
    if (task.includes('exercise')) return emojis.exercise;
    if (task.includes('breakfast')) return emojis.breakfast;
    if (task.includes('meeting')) return emojis.meeting;
    if (task.includes('relax')) return emojis.relax;
    return emojis.work; // Default emoji
}

// Load tasks from localStorage
function loadTasks(hour, taskList) {
    const savedTasks = localStorage.getItem(`task-${hour}`);
    if (savedTasks) {
        taskList.innerHTML = savedTasks;
    }
}

// Clear all tasks
function clearAllTasks() {
    for (let hour = startHour; hour <= endHour; hour++) {
        localStorage.removeItem(`task-${hour}`);
        const taskList = document.getElementById(`task-list-${hour}`);
        taskList.innerHTML = '';
    }
}

// Initial setup
generateTimeBlocks();
