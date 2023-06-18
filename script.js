// Select elements from the DOM
const buttons = document.querySelectorAll(".btn-add-task");
const taskLists = document.querySelectorAll(".task-list");
const sections = document.querySelectorAll(".section");

const btnAddTask = document.querySelector(".modal-button-add");
const btnCanelTask = document.querySelector(".modal-button-cancel");

const modal = document.querySelector(".modal");
const modalTitleInput = document.querySelector("#task-title");
const overlay = document.querySelector(".overlay");

let activeList = [...taskLists]
let savedTasks = [];


// Create and return new task (li) element
function createNewTask(title) {
	// Create a new HTML element
	const html = `
	<li draggable="true" id="draggable-list" class="task">
			<p class="task-description">${title}</p>
			<div>
				<ion-icon class="delete-icon icon" name="trash-outline" aria-label="trash outline" role="img" class="md icon-small hydrated" draggable="false"></ion-icon>
				<ion-icon class="edit-icon icon" name="pencil-outline" aria-label="pencil outline" role="img" class="md icon-small hydrated" draggable="false"></ion-icon>
			</div>
	</li>
		`;

	return html;
}

// Render new task to DOM
const addNewTask = function (title) {
	activeList.insertAdjacentHTML("beforeend", createNewTask(title));
};

const openModal = function () {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

////////////////////////////////////////////////
// Event Listeners
////////////////////////////////////////////////

// Open Modal
buttons.forEach(button => {
	button.addEventListener("click", function () {
		openModal();

		setTimeout(() => {
			modalTitleInput.focus();
		}, 50);

		const parentSection = button.closest(".section");
		activeList = parentSection.querySelector(".task-list");

	});
});

// Close Modal
btnCanelTask.addEventListener("click", function () {
	// Clear the input field & close modal
	closeModal();
	modalTitleInput.value = "";
});

// Confirm Adding new task when the add button is clicked
btnAddTask.addEventListener("click", function (event) {
	event.preventDefault();

	// TEMP
	if (modalTitleInput.value.trim() === "") {
		closeModal();
		return;
	}

	addNewTask(modalTitleInput.value);

	updateLocalStorage();

	// Clear the input field & close modal
	closeModal();

	modalTitleInput.value = "";
});

// Confirm Adding new task when Enter is pressed
modalTitleInput.addEventListener("keyup", function (event) {
	event.preventDefault();

	if (event.keyCode === 13 || event.key === "Enter") {

		// TEMP
		if (modalTitleInput.value.trim() === "") {
			closeModal();
			return;
		}

		addNewTask(modalTitleInput.value);

		// saveTasksInLocalStorage();
		updateLocalStorage();

		// Clear the input field & close modal
		closeModal();
		modalTitleInput.value = "";
	}
});

// Delete task
	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("delete-icon")) {
			const parentLi = event.target.closest("li");
			parentLi.remove();
		}

		updateLocalStorage();
	})


// Edit task



document.addEventListener("click", function (event) {
	if (event.target.classList.contains("edit-icon")) {
	  const task = event.target.closest(".task");
	  const taskDescription = task.querySelector(".task-description");
	  const currentTitle = taskDescription.textContent;
	  
	  taskDescription.contentEditable = true;
	  taskDescription.focus();
	  
	  // Save changes when the user presses Enter
	  taskDescription.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
		  event.preventDefault();
		  taskDescription.contentEditable = false;
		  taskDescription.blur();
		  updateLocalStorage();
		 
		}
	  });
	  
	  // Revert changes when the user presses Escape
	  taskDescription.addEventListener("keyup", function (event) {
		if (event.key === "Escape") {
		  event.preventDefault();
		  taskDescription.contentEditable = false;
		  taskDescription.textContent = currentTitle;
		  taskDescription.blur();
		}
	  });
	}
  });
  

  

////////////////////////////////////////////////
// Local Storage
// Update local storage
function updateLocalStorage() {
	const tasks = [];
  
	taskLists.forEach((taskList) => {
	  const taskItems = taskList.querySelectorAll(".task");
	  const taskData = [];
  
	  taskItems.forEach((taskItem) => {
		const taskDescription = taskItem.querySelector(".task-description");
		const taskTitle = taskDescription.textContent.trim();
  
		taskData.push({
		  title: taskTitle,
		});
	  });
  
	  tasks.push(taskData);
	});
  
	localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  // Initialize tasks from local storage
  function renderTasksFromLocalStorage() {
	const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  
	if (storedTasks) {
	  storedTasks.forEach((taskData, index) => {
		const taskList = taskLists[index];
		
		taskData.forEach((task) => {
		  taskList.insertAdjacentHTML("beforeend", createNewTask(task.title));
		});
	  });
	}
  }

  // Call the function to initialize tasks from local storage
  renderTasksFromLocalStorage();
  
////////////////////////////////////////////////
// Dran and drop (with mouse)
////////////////////////////////////////////////

let dragging;

// drag start
document.addEventListener('dragstart', e => {
	if (e.target.classList.contains('task')) {
	  e.target.classList.add('dragging');
  			dragging = e.target;

	  }
  });
  
  // drag end
  document.addEventListener('dragend', e => {
	if (e.target.classList.contains('task')) {
	  e.target.classList.remove('dragging');
	  			dragging = null;

	}
  })

taskLists.forEach(taskList => {
	taskList.addEventListener('dragover', e => {
	  e.preventDefault();
	  const dragging = document.querySelector('.dragging');
  
	  const frontsibi =getClosestFrontSibling(taskList ,e.clientY)
	  if(frontsibi){
		frontsibi.insertAdjacentElement('afterend',dragging)
		
	  }else{
		taskList.prepend(dragging)
	  }
	  updateLocalStorage()

	});

  });
  
  function getClosestFrontSibling(taskList, draggingY) {
	const siblings = taskList.querySelectorAll('.task:not(.dragging)');
	let result;
  
	for (const sibling of siblings) {
	  const box = sibling.getBoundingClientRect();
	  // 获取 sibling 的 中心 Y
	  const boxCenterY = box.y + box.height / 2;
	  
	  if (draggingY >= boxCenterY) {
		result = sibling;
  
	  } else {
		// draggingY < boxCenterY 
  
		return result  
		;
  
	  }
	}
	return result;
  }
  sections.forEach(section => {
	section.addEventListener("dragover", function (event) {
		event.preventDefault();
		this.classList.add("drag-over");
	});

	section.addEventListener("dragleave", function (event) {
		event.preventDefault();
		this.classList.remove("drag-over");
	});


	section.addEventListener("drop", function (event) {
		event.preventDefault();
		this.classList.remove("drag-over");


		const task = document.querySelector(".dragging");
		if (task) {
			const targetSection = event.target.closest(".section");
			const taskList = targetSection.querySelector(".task-list");
			 taskList.append(task);
		}
		updateLocalStorage();
	});
});

//////////////////////////////////////////
// Touch screens
//////////////////////////////////////////

// Touch event handler functions
let targetSection;
let touchStartX, touchStartY;

// Add touch event listeners to draggable items
taskLists.forEach(task => {
	// Touch event handler for starting a drag
	task.addEventListener("touchstart", function (event) {
		if (event.target.nodeName === "INPUT") return;
		if (event.target.classList.contains("icon")) return;

		dragging = event.target.closest(".task");

		// Store the initial touch coordinates
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;

		// Add dragging class to dragged item
		dragging.classList.add("dragging");
	});

	// Touch event handler for ending a drag
	task.addEventListener("touchend", function (event) {
		let touch = event.changedTouches[0];

		// Check if user dragged the element or just touched it
		if (touch.clientY === touchStartY) {
			dragging.classList.remove("dragging");
			return;
		}

		let minDistance = Infinity;
		for (let i = 0; i < sections.length; i++) {
			let section = sections[i];
			let rect = section.getBoundingClientRect();
			let distance = Math.hypot(
				touch.clientX - rect.left - rect.width / 2,
				touch.clientY - rect.top - rect.height / 2
			);
			if (distance < minDistance) {
				minDistance = distance;
				targetSection = section;
			}
		}

		// Remove dragging class from dragged item
		if (!dragging) return;
		dragging.classList.remove("dragging");
		event.target.closest(".section").classList.remove("drag-over");

		// Move the dragged item to the target section's task list
		targetSection.querySelector(".task-list").appendChild(dragging);

		// Return to normal styles
		sections.forEach(section => section.classList.remove("drag-over"));
		dragging.style.transform = `translate(0, 0)`;

		dragging = null;

		updateLocalStorage();
	});
});

// Add touch event listeners to sections for drag over and drag leave
sections.forEach(section => {
	section.addEventListener("touchmove", touchMove);
	section.addEventListener("touchleave", touchLeave);
});

function touchMove(event) {
	event.preventDefault();

	// Finde closest section to movement
	let touch = event.touches[0];
	let endX = touch.pageX;
	let endY = touch.pageY;
	let distanceMoved = Math.hypot(endX - touchStartX, endY - touchStartY);
	if (distanceMoved > 10) {
		// adjust this threshold as needed
		let minDistance = Infinity;
		for (let i = 0; i < sections.length; i++) {
			let section = sections[i];
			let rect = section.getBoundingClientRect();
			let distanceToSection = Math.hypot(
				touch.clientX - rect.left - rect.width / 2,
				touch.clientY - rect.top - rect.height / 2
			);
			if (distanceToSection < minDistance) {
				minDistance = distanceToSection;
				targetSection = section;
			}
		}
	}

	// Calculate the distance the finger has moved since the touch start
	const touchX = event.touches[0].clientX;
	const touchY = event.touches[0].clientY;
	const deltaX = touchX - touchStartX;
	const deltaY = touchY - touchStartY;

	if (!dragging) return;
	// Move the dragged item using CSS transform
	dragging.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

	// Add drag-over class to the section
	targetSection.classList.add("drag-over");
}

function touchLeave(event) {
	// Remove drag-over class from the section
	event.target.closest(".section").classList.remove("drag-over");
}

//////////////////////////////////////////

let currentLi = null;
let initialPos = null;
let currentPos = null;
let diff = 0;
isTouchMoving = false;

function handleTouchStart(event) {
	if (event.target.nodeName === "INPUT") return;
	if (event.target.classList.contains("icon")) return;

	currentLi = event.target.closest(".task");
	if (!currentLi) return;

	initialPos = event.touches[0].clientY;
	isTouchMoving = false;
}

function handleTouchMove(event) {
	event.preventDefault();

	if (event.target.nodeName === "INPUT") return;
	if (event.target.classList.contains("icon")) return;

	if (!currentLi) return;

	currentPos = event.touches[0].clientY;
	diff = currentPos - initialPos;

	if (Math.abs(diff) < 10) return;

	isTouchMoving = true;

	currentLi.style.transform = `translateY(${diff}px)`;

	const ul = currentLi.closest(".task-list");
	const liArray = [...ul.querySelectorAll(".task")];

	for (const li of liArray) {
		if (li === currentLi) continue;

		const rect = li.getBoundingClientRect();
		const mid = (rect.bottom + rect.top) / 2;

		if (currentPos > mid) {
			li.classList.add("hover-below");
			li.classList.remove("hover-above");
		} else {
			li.classList.add("hover-above");
			li.classList.remove("hover-below");
		}
	}
}

function handleTouchEnd() {
	if (Math.abs(diff) < 10 || !isTouchMoving) return;
	if (!currentLi) return;

	currentLi.style.transform = "";

	const ul = currentLi.closest(".task-list");
	const liArray = [...ul.querySelectorAll(".task")];
	const newIndex = liArray.indexOf(currentLi);

	let i = 0;
	for (const li of liArray) {
		if (li === currentLi) continue;

		const rect = li.getBoundingClientRect();
		const mid = (rect.bottom + rect.top) / 2;

		if (currentPos > mid && newIndex > i) i++;
		if (currentPos < mid && newIndex < i) i--;
	}

	ul.insertBefore(currentLi, liArray[i]);

	document
		.querySelectorAll(".task")
		.forEach(t => t.classList.remove("hover-above", "hover-below"));

	currentLi = null;
	initialPos = null;
	currentPos = null;
	diff = 0;
}

taskLists.forEach(taskList => {
	taskList.addEventListener("touchstart", handleTouchStart);
	taskList.addEventListener("touchmove", handleTouchMove);
	taskList.addEventListener("touchend", handleTouchEnd);
});
