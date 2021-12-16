import {
  createUser,
  handleCreateUser,
  setPageConfEmp,
  findUser,
  createEmpByUser,
  getEmployeeCV,
  getEmployee,
  editEmpMain,
  insertEmpFamily,
  insertEmpProfession,
  insertEmpQtraining,
  insertEmpExperience,
  insertEmpSkill,
  insertEmpMilitary,
  getAllEmployees,
  getAllRoles,
  insertEmpViolation,
  getViolationInfo,
  uploadViolation,
  editEmpViolation,
  startEdit,
  unMountViolation,
  stopEdit,
  onChangeHandlerSetViolation,
  setEmpRole,
  setEmpStaticRole,
  startEditMain,
  stopEditMain,
  addNewInfoHandler,
  onMainChangeHandler,
  deleteEmployee,
  insertEmpReward,
  getSingleEmpBreak,
  createBreak,
  deleteEmpBreak,
  editBreak,
  getEmpVacation,
  submitSelectedDays,
  changeAvatar,
  getEmployeeTimetable,
  getTimetables,
  changeEmployeeTimetable,
  deleteEmpViolation,
  getUserRewards,
  editUserRewards,
  deleteUserRewards,
  getSalaryEmp,
  getSubsidiaryCompanies,
  getLord,
  getEmployeeFromRole,
  getEmployeeStandard,
  uploadExcel,
  insertEmployees,
  clearExcel,
} from "../actionTypes";
import moment from "moment";
const initialState = {
  creatingUser: false,
  findingUser: false,
  creatingEmp: false,
  gettingCV: false,
  gettingEmployee: false,
  gettingAllEmployees: false,
  updatingEmpMain: false,
  settingMarried: false,
  insertingFamily: false,
  settingProfType: false,
  insertingProf: false,
  insertingQtraining: false,
  insertingExp: false,
  insertingSkill: false,
  settingMilitary: false,
  insertingViolation: false,
  gettingViolation: false,
  editingViolation: false,
  settingEmpRole: false,
  settingEmpStaticRole: false,
  gettingEmployees: false,
  visible: false,
  visibleProf: false,
  editingProf: false,
  editingQtraining: false,
  visibleQtraining: false,
  all: 0,
  allViolation: 0,
  employees: [],
  violation: [{}],
  editViolation: {},
  createdUser: {
    username: "",
    phone: "",
    email: "",
    register_id: "",
    first_name: "",
    last_name: "",
    password: "",
  },
  pageConf: {
    menu: "anket",
    submenu: "Ерөнхий мэдээлэл",
    newWorker: false,
  },
  empSingle: {},
  foundedUsers: [],
  editingFamily: false,
  visibleFamily: false,
  visibleExperience: false,
  editingExperience: false,
  visibleSkill: false,
  editingSkill: false,
  editFamily: {},
  editProf: {},
  editQtraining: {},
  editExperience: {},
  editSkill: {},
  editingMain: false,
  editReward: {},
  editingReward: false,
  visibleReward: false,
  insertingReward: false,
  gettingBreak: false,
  breaks: [],
  gettingEmpVacation: false,
  empVacation: [],
  submittingSelectedDays: false,
  gettingTimetable: false,
  timetables: [],
  gettingRewards: false,
  rewards: [],
  salaries: [],
  gettingSalaries: false,
  companies: [],
  gettingSubsidiaryCompanies: false,
  roles: [],
  gettingRoles: false,
  lord: {},
  roleEmployees: [],
  deletingEmployee: false,
  importLoading: false,
  importedExcel: [],
  imported: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case changeAvatar.RESPONSE:
      if(action.json.success){
        return {
          ...state,
          empSingle: {
            ...(state.empSingle || {}),
            user: {
              ...(state.empSingle.user || {}),
              avatar: (action.json.avatar || null),
            },
          }
        };
      } else {
        return {
          ...state,
        };
      }
    case insertEmpMilitary.REQUEST:
      return {
        ...state,
        settingMilitary: true,
      };
    case insertEmpMilitary.RESPONSE:
      return {
        ...state,
        settingMilitary: false,
        empSingle: {
          ...state.empSingle,
          user: {
            ...state.empSingle.user,
            wasInmilitary: action.json.success
              ? action.json.wasInmilitary
              : state.empSingle.user.wasInmilitary,
          },
        },
      };
    case insertEmpSkill.REQUEST:
      return {
        ...state,
        insertingSkill: true,
      };
    case insertEmpSkill.RESPONSE:
      return {
        ...state,
        insertingSkill: false,
        visibleSkill: false,
        editingSkill: false,
        empSingle: {
          ...state.empSingle,
          user: {
            ...(state.empSingle.user || {}),
            ability: action.json.success
              ? action.json.ability
              : state.empSingle.user.ability,
          },
        },
        editSkill: {},
      };
    case insertEmpExperience.REQUEST:
      return {
        ...state,
        insertingExp: true,
      };
    case insertEmpExperience.RESPONSE:
      return {
        ...state,
        insertingExp: false,
        visibleExperience: false,
        editingExperience: false,
        empSingle: {
          ...state.empSingle,
          user: {
            ...(state.empSingle.user || {}),
            work_experience: action.json.success
              ? action.json.work_experience
              : state.empSingle.user.work_experience,
          },
        },
        editExperience: {},
      };
    case insertEmpQtraining.REQUEST:
      return {
        ...state,
        insertingQtraining: true,
      };
    case insertEmpQtraining.RESPONSE:
      return {
        ...state,
        insertingQtraining: false,
        visibleQtraining: false,
        editingQtraining: false,
        empSingle: {
          ...state.empSingle,
          user: {
            ...(state.empSingle.user || {}),
            qualification_training: action.json.success
              ? action.json.qualification_training
              : state.empSingle.user.qualification_training,
          },
        },
        editQtraining: {},
      };
    case insertEmpProfession.REQUEST:
      return {
        ...state,
        settingProfType: action.json.professionType,
        insertingProf: !action.json.professionType,
      };
    case insertEmpProfession.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          insertingProf: false,
          settingProfType: false,
          visibleProf: false,
          editingProf: false,
          empSingle: {
            ...state.empSingle,
            user: {
              ...(state.empSingle.user || {}),
              professionType: action.json.profType
                ? action.json.body.professionType
                : state.empSingle.user.professionType,
              profession: action.json.profType
                ? state.empSingle.user.profession
                : action.json.profession,
            },
          },
          editProf: {},
        };
      } else {
        return {
          ...state,
          settingProfType: false,
          insertingProf: false,
        };
      }
    case insertEmpFamily.REQUEST:
      return {
        ...state,
        settingMarried: action.json.setMarriage,
        insertingFamily: !action.json.setMarriage,
      };
    case insertEmpFamily.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          settingMarried: false,
          insertingFamily: false,
          visibleFamily: false,
          editingFamily: false,
          empSingle: {
            ...state.empSingle,
            user: {
              ...(state.empSingle.user || {}),
              family: {
                ...(state.empSingle.user.family || {}),
                isMarried: action.json.setMarriage
                  ? action.json.body.isMarried
                  : state.empSingle.user.family.isMarried,
                familyMembers: action.json.setMarriage
                  ? state.empSingle.user.family.familyMembers
                  : action.json.fmember,
              },
            },
          },
          editFamily: {},
        };
      } else {
        return {
          ...state,
          settingMarried: false,
          insertingFamily: false,
        };
      }
    case insertEmpReward.RESPONSE:
      return {
        ...state,
        insertingReward: false,
        visibleReward: false,
        editingReward: false,
        empSingle: {
          ...state.empSingle,
          user: {
            ...(state.empSingle.user || {}),
            reward: action.json.success
              ? action.json.reward
              : state.empSingle.user.reward,
          },
        },
        editReward: {},
      };
    case editEmpMain.REQUEST:
      return {
        ...state,
        updatingEmpMain: true,
      };
    case editEmpMain.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          updatingEmpMain: false,
          editingMain: false,
          empSingle: {
            ...state.empSingle,
            emailFromComp:
              (action.json.body || {}).emailFromComp,
            phoneFromComp:
              (action.json.body || {}).phoneFromComp,
            position_name:
              (action.json.body || {}).position_name,
            cardId:
              (action.json.body || {}).cardId,
            workFrom:
              (action.json.body || {}).workFrom,
            user: {
              ...(state.empSingle.user || {}),
              ...(action.json.body || {}),
            },
            bank: {
              name: (action.json.body || {})['bank.name'],
              account: (action.json.body || {})['bank.account'],
            },
          }
          ,
        };
      } else {
        return {
          ...state,
          updatingEmpMain: false,
          empSingle: {
            ...state.empSingle,
            emailFromComp:
              (action.json.body || {}).emailFromComp ||
              state.empSingle.emailFromComp,
            phoneFromComp:
              (action.json.body || {}).phoneFromComp ||
              state.empSingle.phoneFromComp,
            user: {
              ...(state.empSingle.user || {}),
              ...(action.json.body || {}),
            },
          },
        };
      }
    case getEmployee.REQUEST:
      return {
        ...state,
        gettingEmployee: true,
      };
    case getEmployee.RESPONSE:
      return {
        ...state,
        gettingEmployee: false,
        empSingle: action.json.employee,
      };
    case getEmployeeCV.REQUEST:
      return {
        ...state,
        gettingCV: true,
      };
    case getEmployeeCV.RESPONSE:
      return {
        ...state,
        gettingCV: false,
        empSingle: {
          ...state.empSingle,
          cv: action.json.cv,
        },
        violation: (action.json.cv || {}).violation_info,
        gettingViolation: false,
      };
    case createEmpByUser.REQUEST:
      return {
        ...state,
        creatingEmp: true,
        foundedUsers: state.foundedUsers.map(c => {
          if (c._id === action.json.data) {
            c.loading = true;
          }
          return c;
        }),
      };
    case createEmpByUser.RESPONSE:
      return {
        ...state,
        creatingEmp: false,
        foundedUsers: state.foundedUsers.map(c => {
          delete c.loading;
          return c;
        }),
      };
    case findUser.REQUEST:
      return {
        ...state,
        findingUser: true,
      };
    case findUser.RESPONSE:
      return {
        ...state,
        findingUser: false,
        foundedUsers: action.json.users || [],
      };
    case setPageConfEmp.REQUEST:
      return {
        ...state,
        pageConf: {
          ...state.pageConf,
          ...action.data,
        },
      };
    case handleCreateUser.REQUEST:
      let ctU = {
        ...state.createdUser,
        ...action.data,
      };
      delete ctU.exists;
      delete ctU.user;
      delete ctU.employee;
      return {
        ...state,
        createdUser: ctU,
      };
    case createUser.REQUEST:
      return {
        ...state,
        creatingUser: true,
      };
    case createUser.RESPONSE:
      return {
        ...state,
        creatingUser: false,
        createdUser: {
          ...state.createdUser,
          user: action.json.user,
          employee: action.json.employee || null,
          exists: action.json.exists,
        },
      };
    case getAllEmployees.REQUEST:
      return {
        ...state,
        gettingAllEmployees: true,
      };
    case getAllEmployees.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          employees: action.json?.employees,
          all: action.json?.all,
          gettingAllEmployees: false,
        };
      } else {
        return {
          ...state,
          gettingAllEmployees: false,
        };
      }
    case getSubsidiaryCompanies.REQUEST:
      return {
        ...state,
        gettingSubsidiaryCompanies: true
      }
    case getSubsidiaryCompanies.RESPONSE:
      if(action.json?.success){
        return {
          ...state,
          gettingSubsidiaryCompanies: false,
          companies: action.json?.companies
        }
      }else{
        return{
          ...state,
          gettingSubsidiaryCompanies: false,
        }
      }
    case insertEmpViolation.REQUEST:
      return {
        ...state,
        insertingViolation: true,
      };
    case insertEmpViolation.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          insertingViolation: false,
          editViolation: {},
          visible: false,
          violation: action.json.violation,
        };
      } else {
        return {
          ...state,
          insertingViolation: false,
        };
      }
    case deleteEmpViolation.REQUEST:
      return {
        ...state,
        insertingViolation: true
      }
    case deleteEmpViolation.RESPONSE:
      return {
        ...state,
        insertingViolation: false,
        violation: action.json.success ? action.json.violation : state.violation
      }
    case getViolationInfo.REQUEST:
      return {
        ...state,
        gettingViolation: true,
      };
    case getViolationInfo.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          gettingViolation: false,
          violation: action.json.violation.violation_info || {},
        };
      } else {
        return {
          ...state,
          gettingViolation: false,
        };
      }
    case uploadViolation.REQUEST:
      return {
        ...state,
      };
    case editEmpViolation.REQUEST:
      return {
        ...state,
        editingViolation: true,
      };
    // case editEmpViolation.RESPONSE:
    //     if(action.json.success) {
    //         return {
    //             ...state,
    //             editingViolation: false,
    //             editViolation: action.json.editViolation
    //         }
    //     } else {
    //         return {
    //             ...state,
    //             editingViolation: false
    //         }
    //     }
    case unMountViolation.REQUEST:
      return {
        ...state,
        violation: [{}],
        editViolation: {},
        visible: false,
      };
    case startEdit.REQUEST:
      return {
        ...state,
        editViolation: action.data,
        visible: true,
      };
    case stopEdit.REQUEST:
      return {
        ...state,
        editViolation: {},
        visible: false,
      };
    case onChangeHandlerSetViolation.REQUEST:
      return {
        ...state,
        editViolation: {
          ...state.editViolation,
          [action.data.name]: action.data.value,
        },
      };
    case setEmpRole.REQUEST:
      return {
        ...state,
        settingEmpRole: true,
      };
    case setEmpRole.RESPONSE:
      if (action.json.success) {
        return {
          ...state,
          settingEmpRole: false,
        };
      } else {
        return {
          ...state,
          settingEmpRole: false,
        };
      }
    case startEditMain.REQUEST:
      switch (action.data.editing) {
        case "main":
          return {
            ...state,
            editingMain: true,
          };
        case "family":
          return {
            ...state,
            editFamily: action.data,
            editingFamily: true,
            visibleFamily: true,
          };
        case "prof":
          return {
            ...state,
            editProf: action.data,
            editingProf: true,
            visibleProf: true,
          };
        case "Qtraining":
          return {
            ...state,
            editQtraining: action.data,
            editingQtraining: true,
            visibleQtraining: true,
          };
        case "experience":
          return {
            ...state,
            editExperience: action.data,
            editingExperience: true,
            visibleExperience: true,
          };
        case "skill":
          return {
            ...state,
            editSkill: action.data,
            editingSkill: true,
            visibleSkill: true,
          };
        case "reward":
          return {
            ...state,
            editReward: action.data,
            editingReward: true,
            visibleReward: true,
          };
        default:
          return state;
      }
    case stopEditMain.REQUEST:
      switch (action.data.stopping) {
        case "family":
          return {
            ...state,
            editFamily: {},
            visibleFamily: false,
          };
        case "prof":
          return {
            ...state,
            editProf: {},
            visibleProf: false,
          };
        case "Qtraining":
          return {
            ...state,
            editQtraining: {},
            visibleQtraining: false,
          };
        case "experience":
          return {
            ...state,
            editExperience: {},
            visibleExperience: false,
          };
        case "skill":
          return {
            ...state,
            editSkill: {},
            visibleSkill: false,
          };
        case "main":
          return {
            ...state,
            editingMain: false,
          };
        case "reward":
          return {
            ...state,
            editReward: {},
            visibleReward: false,
          };
        default:
          return state;
      }
    case addNewInfoHandler.REQUEST:
      switch (action.data.adding) {
        case "family":
          return {
            ...state,
            visibleFamily: true,
            editingFamily: false,
          };
        case "prof":
          return {
            ...state,
            visibleProf: true,
            editingProf: false,
          };
        case "Qtraining":
          return {
            ...state,
            visibleQtraining: true,
            editingQtraining: false,
          };
        case "experience":
          return {
            ...state,
            visibleExperience: true,
            editingExperience: false,
          };
        case "skill":
          return {
            ...state,
            visibleSkill: true,
            editingSkill: false,
          };
        case "reward":
          return {
            ...state,
            visibleReward: true,
            editingReward: false,
          };
        default:
          return state;
      }
    case onMainChangeHandler.REQUEST:
      switch (action.data.changing) {
        case "family":
          return {
            ...state,
            editFamily: {
              ...state.editFamily,
              [action.data.name]: action.data.value,
            },
          };
        case "prof":
          return {
            ...state,
            editProf: {
              ...state.editProf,
              [action.data.name]: action.data.value,
            },
          };
        case "Qtraining":
          return {
            ...state,
            editQtraining: {
              ...state.editQtraining,
              [action.data.name]: action.data.value,
            },
          };
        case "experience":
          return {
            ...state,
            editExperience: {
              ...state.editExperience,
              [action.data.name]: action.data.value,
            },
          };
        case "skill":
          return {
            ...state,
            editSkill: {
              ...state.editSkill,
              [action.data.name]: action.data.value,
            },
          };
        case "reward":
          return {
            ...state,
            editReward: {
              ...state.editReward,
              [action.data.name]: action.data.value,
            },
          };
        default:
          return state;
      }
    case deleteEmployee.REQUEST:
      return {
        ...state,
        deletingEmployee: true,
      };
    case deleteEmployee.RESPONSE:
      return {
        ...state,
        deletingEmployee: false,
      }
    case setEmpStaticRole.REQUEST:
      return {
        ...state,
        settingEmpStaticRole: true,
      };
    case setEmpStaticRole.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          settingEmpStaticRole: false,
          empSingle: {
            ...state.empSingle,
            staticRole: (action.json || {}).staticRole || state.empSingle.staticRole
          },
        };
      }else{
        return {
          ...state,
          settingEmpStaticRole: false
        }
      }
    case getSingleEmpBreak.REQUEST:
      return {
        ...state,
        gettingBreak: true,
      };
    case getSingleEmpBreak.RESPONSE:
      return {
        ...state,
        gettingBreak: false,
        breaks: action.json.breaks || [],
      };
    case createBreak.REQUEST:
      return {
        ...state,
        gettingBreak: true,
      };
    case createBreak.RESPONSE:
      if(action.json.success){
        if(action.json.id){
          let date = new Date();
          return{
            ...state,
            gettingBreak: false,
            breaks: state.breaks.map(brek => {
              if(brek._id.toString() !== action.json.id){
                return brek;
              }
              return {
                ...brek,
                status: (action.json.status || 'pending'),
                starting_date: (action.json.starting_date || date),
                ending_date: (action.json.ending_date || date),
                howManyDaysPaid: (action.json.number || 0),
                reason: (action.json.reason || '')
              }
            })
          }
        }else{
          return {
            ...state,
            gettingBreak: false,
            breaks:
                action.json.success && action.json.break
                    ? [action.json.break, ...state.breaks ]
                    : state.breaks,
          };
        }
      }else{
        return {
          ...state,
          gettingBreak: false
        };
      }
    case deleteEmpBreak.REQUEST:
      return {
        ...state,
        gettingBreak: true,
      };
    case deleteEmpBreak.RESPONSE:
      return {
        ...state,
        gettingBreak: false,
        breaks: state.breaks.filter(breaked => breaked._id !== action.json.id),
      };
    case getEmpVacation.REQUEST:
      return {
        ...state,
        gettingEmpVacation: true,
      };
    case getEmpVacation.RESPONSE:
      return {
        ...state,
        gettingEmpVacation: false,
        empVacation: action.json.success
          ? action.json.empVacation
          : state.empVacation,
      };
    case submitSelectedDays.REQUEST:
      return {
        ...state,
        submittingSelectedDays: true
      }
    case submitSelectedDays.RESPONSE:
      return {
        ...state,
        empVacation: action.json.success ?
            state.empVacation.map(vac => {
              if(vac._id.toString() !== action.json.empVacation._id) {
                return vac
              } else {
                return {
                  ...vac,
                  status: action.json.empVacation.status,
                  selected_dates: action.json.empVacation.selected_dates
                }
              }
            })
            : state.empVacation,
        submittingSelectedDays: false
      }
    case getTimetables.REQUEST:
      return {
        ...state,
        gettingTimetable: true
      };
    case getTimetables.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingTimetable: false,
          timetables: ((action.json || {}).timetables || [])
        }
      }else{
        return {
          ...state,
          gettingTimetable: false
        }
      }
    case getEmployeeTimetable.REQUEST:
      return {
        ...state,
        gettingTimetable: true
      };
    case getEmployeeTimetable.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingTimetable: false,
          empSingle: {
            ...state.empSingle,
            timetable: ((action.json || {}).timetable || {})
          }
        }
      }else{
        return {
          ...state,
          gettingTimetable: false
        }
      }
    case changeEmployeeTimetable.REQUEST:
      return {
        ...state,
        gettingTimetable: true
      };
    case changeEmployeeTimetable.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingTimetable: false,
          empSingle: {
            ...state.empSingle,
            timetable: ((action.json || {}).timetable || {})
          }
        }
      }else{
        return {
          ...state,
          gettingTimetable: false
        }
      }
    case getUserRewards.REQUEST:
      return {
        ...state,
        gettingRewards: true
      };
    case getUserRewards.RESPONSE:
      return {
        ...state,
        rewards: action.json.success ? action.json.rewards : state.rewards,
        gettingRewards: false
      };
    case editUserRewards.REQUEST:
      return {
        ...state
      };
    case editUserRewards.RESPONSE:
      return {
        ...state,
        rewards: action.json.success ? action.json.rewards : state.rewards
      };
    case deleteUserRewards.REQUEST:
      return {
        ...state
      };
    case deleteUserRewards.RESPONSE:
      return {
        ...state,
        rewards: action.json.success ? action.json.rewards : state.rewards
      };
    case getSalaryEmp.REQUEST:
      return {
        ...state,
        gettingSalaries: true
      };
    case getSalaryEmp.RESPONSE:
      if((action.json || {}).success){
        return{
          ...state,
          gettingSalaries: false,
          salaries: ((action.json || {}).salaries || [])
        }
      }else{
        return {
          ...state,
          gettingSalaries: false
        }
      }
    case getEmployeeFromRole.REQUEST:
      return {
        ...state,
        gettingEmployees: true
      }
    case getEmployeeFromRole.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingEmployees: false,
          roleEmployees: [...(state.roleEmployees || []), ...((action.json || {}).employees || [])],
        }
      }else{
        return {
          ...state,
          gettingEmployees: false,
        }
      }
    case getAllRoles.REQUEST:
      return {
        ...state,
        gettingRoles: true
      }
    case getAllRoles.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingRoles: false,
          roles: ((action.json || {}).roles || [])
        }
      }else{
        return {
          ...state,
          gettingRoles: false,
          roles: []
        }
      }
    case getLord.REQUEST:
      return {
        ...state,
        gettingEmployees: true,
      }
    case getLord.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingEmployees: false,
          lord: ((action.json || {}).lord)
        }
      }else{
        return {
          ...state,
          gettingEmployees: false
        }
      }
    case getEmployeeStandard.REQUEST:
      return {
        ...state,
        gettingEmployees: true
      }
    case getEmployeeStandard.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          gettingEmployees: false,
          employees: ((action.json || {}).employees || [])
        }
      }else{
        return {
          ...state,
          gettingEmployees: false
        }
      }
    case uploadExcel.REQUEST:
      return {
          ...state,
          importLoading: true
      }
    case uploadExcel.RESPONSE:
      if(action.json.success){
        return {
            ...state,
            importLoading: false,
            importedExcel: action.json.data,
            imported: true
        }
      }else{
        return {
            ...state,
            importLoading: false,
        }
      }
    case clearExcel.REQUEST:
      return {  
          ...state,
          importedExcel: [],
          imported: false
      } 
    case insertEmployees.REQUEST:
      return {
        ...state,
        gettingAllEmployees: true
      }
    case insertEmployees.RESPONSE:
      return {
        ...state,
        gettingAllEmployees: false,
        
      }
    default:
      return state;
  }
};
