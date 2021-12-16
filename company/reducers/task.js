import moment from "moment";
import {
	getTasks,
	createTask,
	changeTask,
	getEmployeeStandard,
	getEmployeeStandardInner,
	getSubTagsWithParent,
	getSubsidiaryCompanies,
	getDoneTasks,
	getIdleTasks,
	finishTask
} from "../actionTypes";

const initialState = {
	loadingTasks: false,
	tasks: [],
	creatingTask: false,
	changingTask: "",
	loadingEmployees: false,
	employees: [],
	loadingEmployeesInner: false,
	employeesInner: [],
	loadingSubtags: false,
	subtags: [],
	loadingCompanies: false,
	companies: [],
	loadingDoneTasks: false,
	doneTasks: [],
	view: "user",
	loadingMore: false,
	loadingIdleTasks: false,
	idleTasks: [],
	finishingTask: ""
};

function getChangedTasks(tasks, _id, status, newTask, view, filters) {
	if (status === "delete") {
		tasks = (tasks || []).map((mainOne) => {
			let changed = mainOne.tasks || [];
			changed = changed.filter(
				(change) =>
					(change._id || "as").toString() !== (_id || "").toString()
			);
			return {
				...(mainOne || {}),
				tasks: changed || []
			};
		});
	} else if (
		status === "finished" ||
		status === "done" ||
		status === "declined" ||
		status === "doing"
	) {
		tasks = (tasks || []).map((mainOne) => {
			let changed = mainOne.tasks || [];
			changed = (changed || []).map((change) => {
				if ((change._id || "as").toString() !== (_id || "").toString())
					return change;
				return {
					...change,
					status: status
				};
			});
			return {
				...(mainOne || {}),
				tasks: changed || []
			};
		});
	}
	// else if (status === "edited") {
	// 	tasks = (tasks || []).map((mainOne) => {
	// 		let changed = mainOne.tasks || [];
	// 		changed = (changed || []).map((change) => {
	// 			if ((change._id || "as").toString() !== (_id || "").toString())
	// 				return change;
	// 			return newTask || {};
	// 		});
	// 		return {
	// 			...(mainOne || {}),
	// 			tasks: changed || []
	// 		};
	// 	});
	// }
	else if (status === "created" || status === "edited") {
		let enter = true;
		if (
			filters.company &&
			filters.company !== "all" &&
			(filters.company || "as").toString() !==
				(newTask.company || "").toString()
		) {
			enter = false;
		}
		if (filters.starting_date && filters.ending_date) {
			let startDate = new Date(filters.starting_date),
				endDate = new Date(filters.ending_date);
			let arrOfDates = [];
			while (startDate <= endDate) {
				arrOfDates.push(moment(startDate).format("YYYY-MM-DD"));
				startDate.setDate(startDate.getDate() + 1);
			}
			if (!newTask.dates.some((date) => arrOfDates.includes(date))) {
				enter = false;
			}
		}
		if (filters.employee && (filters.employee || "as").toString()) {
			let allEmployees = [
				...(newTask.employees || []).map((emp) =>
					(emp.emp || "").toString()
				)
			];
			if (
				!(allEmployees || []).includes(
					(filters.employee || "").toString()
				)
			) {
				enter = false;
			}
		}
		if (filters.search) {
			let newReg = new RegExp(".*" + search + ".*", "i");
			if (
				!newReg.test(newTask.title) ||
				!newReg.test(newTask.description)
			) {
				enter = false;
			}
		}
		if (
			filters.subtag &&
			filters.subtag !== "all" &&
			(filters.subtag || "as").toString() !==
				(newTask.tag?._id || "").toString()
		) {
			enter = false;
		}
		if (enter) {
			if (status === "edited") {
				//baigaa taskiig uurchluh
				tasks = (tasks || []).map((mainOne) => {
					let changed = mainOne.tasks || [];
					changed = (changed || []).map((change) => {
						if (
							(change._id || "as").toString() !==
							(_id || "").toString()
						)
							return change;
						return newTask || {};
					});
					return {
						...(mainOne || {}),
						tasks: changed || []
					};
				});
			}
			if (view === "user" || filters?.view === "user") {
				let allEmployees = [
					...(newTask.employees || []).map((emp) =>
						(emp.emp || "").toString()
					)
				];
				tasks = (tasks || []).map((mainOne) => {
					if (
						!(allEmployees || []).includes(
							(mainOne._id || "as").toString()
						)
					) {
						return mainOne;
					} else {
						if (
							(mainOne.tasks || []).every(
								(task) =>
									(task._id || "as").toString() !==
									(_id || "").toString()
							)
						) {
							return {
								...(mainOne || {}),
								tasks: [newTask, ...(mainOne.tasks || [])]
							};
						} else {
							return mainOne;
						}
					}
				});
				if (status === "edited") {
					tasks = (tasks || []).map((mainOne) => {
						if (
							(mainOne.tasks || []).some(
								(task) =>
									(_id || "as").toString() ===
									(task._id || "").toString()
							)
						) {
							if (
								!(allEmployees || []).includes(
									(mainOne._id || "as").toString()
								)
							) {
								return {
									...(mainOne || {}),
									tasks: (mainOne.tasks || []).filter(
										(task) =>
											(task._id || "as").toString() !==
											(_id || "").toString()
									)
								};
							} else {
								return mainOne;
							}
						} else {
							return mainOne;
						}
					});
				}
			} else if (view === "tag" || filters?.view === "tag") {
				tasks = (tasks || []).map((mainOne) => {
					if (
						(mainOne._id || "as").toString() !==
						((newTask.tag || {})._id || "").toString()
					) {
						return mainOne;
					} else {
						if (
							(mainOne.tasks || []).every(
								(task) =>
									(task._id || "as").toString() !==
									(_id || "").toString()
							)
						) {
							return {
								...(mainOne || {}),
								tasks: [newTask, ...(mainOne.tasks || [])]
							};
						} else {
							return mainOne;
						}
					}
				});
				if (status === "edited") {
					tasks = (tasks || []).map((mainOne) => {
						if (
							(mainOne.tasks || []).some(
								(task) =>
									(_id || "as").toString() ===
									(task._id || "").toString()
							)
						) {
							if (
								(mainOne._id || "as").toString() !==
								((newTask.tag || {})._id || "").toString()
							) {
								return {
									...(mainOne || {}),
									tasks: (mainOne.tasks || []).filter(
										(task) =>
											(task._id || "as").toString() !==
											(_id || "").toString()
									)
								};
							} else {
								return mainOne;
							}
						} else {
							return mainOne;
						}
					});
				}
			} else {
				tasks = (tasks || []).map((mainOne) => {
					if (
						!(newTask.dates || []).includes(
							moment(mainOne.date).format("YYYY-MM-DD")
						)
					) {
						return mainOne;
					} else {
						if (
							(mainOne.tasks || []).every(
								(task) =>
									(task._id || "as").toString() !==
									(_id || "").toString()
							)
						) {
							return {
								...(mainOne || {}),
								tasks: [newTask, ...(mainOne.tasks || [])]
							};
						} else {
							return mainOne;
						}
					}
				});
				if (status === "edited") {
					tasks = (tasks || []).map((mainOne) => {
						if (
							(mainOne.tasks || []).some(
								(task) =>
									(_id || "as").toString() ===
									(task._id || "").toString()
							)
						) {
							if (
								!(newTask.dates || []).includes(
									moment(mainOne.date).format("YYYY-MM-DD")
								)
							) {
								return {
									...(mainOne || {}),
									tasks: (mainOne.tasks || []).filter(
										(task) =>
											(task._id || "as").toString() !==
											(_id || "").toString()
									)
								};
							} else {
								return mainOne;
							}
						} else {
							return mainOne;
						}
					});
				}
			}
		} else {
			if (status === "edited") {
				tasks = (tasks || []).map((mainOne) => {
					let changed = mainOne.tasks || [];
					changed = (changed || []).map((change) => {
						if (
							(change._id || "as").toString() !==
							(_id || "").toString()
						)
							return change;
						return newTask || {};
					});
					return {
						...(mainOne || {}),
						tasks: changed || []
					};
				});
			}
		}
	}
	return tasks;
}

export default (state = initialState, action) => {
	switch (action.type) {
		case getTasks.REQUEST:
			if (
				(action.json || {}).view === state.view &&
				(action.json || {}).pageNum !== 0
			) {
				return {
					...state,
					loadingMore: true
				};
			} else {
				return {
					...state,
					loadingTasks: true
				};
			}
		case getTasks.RESPONSE:
			if ((action.json || {}).success) {
				let main = (action.json || {}).extra || [],
					tasks = (action.json || {}).tasks || [];
				if ((action.json || {}).view === "user") {
					main = (main || []).map((mainOne) => {
						let temp = [];
						(tasks || []).map((task) => {
							if (
								(task.employees || []).some(
									(emp) =>
										(emp.emp || "as").toString() ===
										(mainOne._id || "").toString()
								)
							) {
								let emps = task.employees || [],
									filteredList = task.list || [];
								if (
									Object.keys((emps || [])[0] || {}).length <
									2
								)
									emps = [];
								if (
									Object.keys(filteredList[0] || {}).length <
									2
								) {
									filteredList = [];
								}
								temp.push({
									...task,
									employees: emps,
									list: filteredList
								});
							}
						});
						return {
							...mainOne,
							tasks: temp || []
						};
					});
				} else if ((action.json || {}).view === "tag") {
					main = (main || []).map((mainOne) => {
						let temp = [];
						(tasks || []).map((task) => {
							if (
								(task.tag?._id || "as").toString() ===
								(mainOne._id || "").toString()
							) {
								let emps = task.employees || [],
									filteredList = task.list || [];
								if (
									Object.keys((emps || [])[0] || {}).length <
									2
								)
									emps = [];
								if (
									Object.keys(filteredList[0] || {}).length <
									2
								) {
									filteredList = [];
								}
								temp.push({
									...task,
									employees: emps,
									list: filteredList
								});
							}
						});
						return {
							...mainOne,
							tasks: temp || []
						};
					});
				} else {
					main = (main || []).map((mainOne) => {
						let temp = [];
						(tasks || []).map((task) => {
							if (
								(task.dates || []).some(
									(date) => date === mainOne
								)
							) {
								let emps = task.employees || [],
									filteredList = task.list || [];
								if (
									Object.keys((emps || [])[0] || {}).length <
									2
								)
									emps = [];
								if (
									Object.keys(filteredList[0] || {}).length <
									2
								) {
									filteredList = [];
								}
								temp.push({
									...task,
									employees: emps,
									list: filteredList
								});
							}
						});
						return {
							date: mainOne,
							tasks: temp || []
						};
					});
				}
				if (
					(action.json || {}).view === state.view &&
					(action.json || {}).pageNum !== 0
				) {
					return {
						...state,
						loadingMore: false,
						tasks: [...(state.tasks || []), ...(main || [])]
					};
				} else {
					return {
						...state,
						view: (action.json || {}).view,
						loadingTasks: false,
						tasks: main,
						all: (action.json || {}).all || 0
					};
				}
			} else {
				return {
					...state,
					loadingTasks: false,
					loadingMore: false
				};
			}
		case createTask.REQUEST:
			return {
				...state,
				creatingTask: true
			};
		case createTask.RESPONSE:
			if ((action.json || {}).success) {
				if ((action.json || {})._id) {
					return {
						...state,
						creatingTask: false,
						tasks: getChangedTasks(
							state.tasks,
							(action.json || {})._id,
							"edited",
							(action.json || {}).task,
							state.view,
							(action.json || {}).filter
						)
					};
				} else {
					return {
						...state,
						creatingTask: false,
						tasks: getChangedTasks(
							state.tasks,
							"",
							"created",
							(action.json || {}).task,
							state.view,
							(action.json || {}).filter
						)
					};
				}
			} else {
				return {
					...state,
					creatingTask: false
				};
			}
		case changeTask.REQUEST:
			return {
				...state,
				changingTask: (action.json || {})._id
			};
		case changeTask.RESPONSE:
			if ((action.json || {}).success) {
				let task = {};
				(state.tasks || []).map((tas) => {
					(tas.tasks || []).map((ta) => {
						if (
							((action.json || {})._id || "as").toString() ===
							(ta._id || {}).toString()
						) {
							task = ta;
						}
					});
				});
				task.status === action.json?.status;
				if (action.json?.status === "delete") {
					if (action.json?.access) {
						return {
							...state,
							changingTask: "",
							tasks: getChangedTasks(
								state.tasks,
								(action.json || {})._id || "as",
								(action.json || {}).status || "as"
							),
							doneTasks: (state.doneTasks || []).filter(
								(task) =>
									(task._id || "as").toString() !==
									(action.json._id || "").toString()
							)
						};
					} else {
						return {
							...state,
							changingTask: "",
							tasks: getChangedTasks(
								state.tasks,
								(action.json || {})._id || "as",
								(action.json || {}).status || "as"
							),
							idleTasks: (state.idleTasks || []).filter(
								(task) =>
									(task._id || "as").toString() !==
									(action.json._id || "").toString()
							)
						};
					}
				} else if (action.json?.status === "doing") {
					if (action.json?.access) {
						return {
							...state,
							changingTask: "",
							tasks: getChangedTasks(
								state.tasks,
								(action.json || {})._id || "as",
								(action.json || {}).status || "as"
							),
							doneTasks: (state.doneTasks || []).filter(
								(task) =>
									(task._id || "as").toString() !==
									(action.json._id || "").toString()
							)
						};
					} else {
						return {
							...state,
							changingTask: "",
							tasks: getChangedTasks(
								state.tasks,
								(action.json || {})._id || "as",
								(action.json || {}).status || "as"
							),
							idleTasks: [...(state.idleTasks || []), task]
						};
					}
				} else {
					if ((action.json || {}).access) {
						return {
							...state,
							changingTask: "",
							tasks: getChangedTasks(
								state.tasks,
								(action.json || {})._id || "as",
								(action.json || {}).status || "as"
							),
							doneTasks: [...(state.doneTasks || []), task]
						};
					} else {
						return {
							...state,
							changingTask: "",
							tasks: getChangedTasks(
								state.tasks,
								(action.json || {})._id || "as",
								(action.json || {}).status || "as"
							),
							idleTasks: (state.idleTasks || []).filter(
								(task) =>
									(task._id || "as").toString() !==
									(action.json._id || "").toString()
							)
						};
					}
				}
			} else {
				return {
					...state,
					changingTask: ""
				};
			}
		case finishTask.REQUEST:
			return {
				...state,
				finishingTask: (action.json || {})._id
			};
		case finishTask.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					tasks: getChangedTasks(
						state.tasks,
						(action.json || {})._id,
						(action.json || {}).status
					),
					finishingTask: "",
					doneTasks: (state.doneTasks || []).filter(
						(task) =>
							task._id.toString() !==
							(action.json?._id).toString()
					)
				};
			} else {
				return {
					...state,
					finishingTask: ""
				};
			}
		case getEmployeeStandard.REQUEST:
			return {
				...state,
				loadingEmployees: true
			};
		case getEmployeeStandard.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingEmployees: false,
					employees: (action.json || {}).employees || []
				};
			} else {
				return {
					...state,
					loadingEmployees: false
				};
			}
		case getEmployeeStandardInner.REQUEST:
			return {
				...state,
				loadingEmployeesInner: true
			};
		case getEmployeeStandardInner.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingEmployeesInner: false,
					employeesInner: (action.json || {}).employees || []
				};
			} else {
				return {
					...state,
					loadingEmployeesInner: false
				};
			}
		case getSubTagsWithParent.REQUEST:
			return {
				...state,
				loadingSubtags: true
			};
		case getSubTagsWithParent.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingSubtags: false,
					subtags: (action.json || {}).workplan_tags || []
				};
			} else {
				return {
					...state,
					loadingSubtags: false
				};
			}
		case getSubsidiaryCompanies.REQUEST:
			return {
				...state,
				loadingCompanies: true
			};
		case getSubsidiaryCompanies.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingCompanies: false,
					companies: (action.json || {}).companies
				};
			} else {
				return {
					...state,
					loadingCompanies: false
				};
			}
		case getDoneTasks.REQUEST:
			return {
				...state,
				loadingDoneTasks: true
			};
		case getDoneTasks.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingDoneTasks: false,
					doneTasks: (action.json || {}).tasks || []
				};
			} else {
				return {
					...state,
					loadingDoneTasks: false
				};
			}
		case getIdleTasks.REQUEST:
			return {
				...state,
				loadingIdleTasks: true
			};
		case getIdleTasks.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingIdleTasks: false,
					idleTasks: (action.json || {}).tasks || []
				};
			} else {
				return {
					...state,
					loadingIdleTasks: false
				};
			}
		default:
			return state;
	}
};
