import {
    getDepartment,
    departmentUnmount,
    openModalDep,
    closeModalDep,
    onChangeHandlerSetDep,
    submitDepartment,
} from "../actionTypes";
import config from "../config";
const initialState = {
    gettingDepartment: true,
    creatingDepartment: false,
    visible: false,
    department:{},
    departments:[],
    all:0,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case submitDepartment.REQUEST:
            return {
                ...state,
                creatingDepartment: true
            };
        case submitDepartment.RESPONSE:
            if(action.json.success){
                if(action.json._id){
                    return {
                        ...state,
                        creatingDepartment: false,
                        visible: false,
                        departments: state.departments.map(function (run) {
                            if(run._id === action.json._id){
                                run.title =  action.json.data.title;
                            }
                            return run;
                        }),
                        department:{}
                    };
                } else {
                    return {
                        ...state,
                        creatingDepartment: false,
                        visible: false,
                        all: state.all + 1,
                        departments:[
                            action.json.data,
                            ...state.departments,
                        ],
                        department:{}
                    };
                }
            } else {
                return {
                    ...state,
                    creatingDepartment: false,
                };
            }
        case onChangeHandlerSetDep.REQUEST:
            return {
                ...state,
                department:{
                    ...state.department,
                    [action.json.name]:action.json.value
                },
            };
        case openModalDep.REQUEST:
            return {
                ...state,
                visible:true,
                department:(action.json || {}),
            };
        case closeModalDep.REQUEST:
            return {
                ...state,
                visible:false,
                department:{},
            };
        case departmentUnmount.REQUEST:
            return {
                ...state,
                gettingDepartment: true,
                department: {},
            };
        case getDepartment.REQUEST:
            return {
                ...state,
                gettingDepartment: false
            };
        case getDepartment.RESPONSE:
            return {
                ...state,
                statusEdit: 0,
                departments: (action.json.departments || []),
                all: (action.json.all || 0),
            };
        // case getChecked.REQUEST:
        //     if(action.json._id){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = true;
        //                 }
        //                 return run;
        //             } )
        //         };
        //     } else {
        //         return {
        //             ...state
        //         };
        //     }
        // case getChecked.RESPONSE:
        //     if(action.json.success && action.json._id && action.json.publish){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = false;
        //                     run.publish = (action.json.publish || run.publish);
        //                 }
        //                 return run;
        //             } ),
        //         };
        //     } else {
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = false;
        //                 }
        //                 return run;
        //             } ),
        //         };
        //     }
        // case unPublish.REQUEST:
        //     if(action.json._id){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = true;
        //                 }
        //                 return run;
        //             } )
        //         };
        //     } else {
        //         return {
        //             ...state
        //         };
        //     }
        // case unPublish.RESPONSE:
        //     if(action.json.success && action.json._id && action.json.lessonPublish){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = false;
        //                     run.publish = (action.json.publish || run.publish);
        //                     run.lessonPublish = action.json.lessonPublish;
        //                 }
        //                 return run;
        //             } ),
        //         };
        //     } else {
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = false;
        //                 }
        //                 return run;
        //             } ),
        //         };
        //     }
        // case publishLesson.REQUEST:
        //     if(action.json._id){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = true;
        //                 }
        //                 return run;
        //             } )
        //         };
        //     } else {
        //         return {
        //             ...state
        //         };
        //     }
        // case publishLesson.RESPONSE:
        //     if(action.json.success && action.json._id && action.json.lessonPublish){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = false;
        //                     run.publish = (action.json.publish || run.publish);
        //                     run.lessonPublish = action.json.lessonPublish;
        //                 }
        //                 return run;
        //             } ),
        //         };
        //     } else {
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = false;
        //                 }
        //                 return run;
        //             } ),
        //         };
        //     }
        // case setFeatured.REQUEST:
        //     let featured = !!state.lesson.featured
        //     return {
        //         ...state,
        //         lesson:{
        //             ...state.lesson,
        //             featured: !featured
        //         }
        //     };
        // case chooseMediaLessonEdit.REQUEST:
        //     if(action.json.medType === 'video'){
        //         return {
        //             ...state,
        //             lessonVideo: action.json.data[0]
        //         };
        //     }
        //     if(action.json.medType === 'image'){
        //         if(action.json.forWhat === 'lesson'){
        //             return {
        //                 ...state,
        //                 lessonImage: action.json.data[0]
        //             };
        //         } else if(action.json.forWhat === 'lessonSmall'){
        //             return {
        //                 ...state,
        //                 lessonSmallImage: action.json.data[0]
        //             };
        //         }
        //     }
        //     return {
        //         ...state,
        //     };
        // case removeUploadedFileLessonEdit.REQUEST:
        //     return {
        //         ...state,
        //         [action.json.name]: {},
        //     };
        // case openLevelSingle.REQUEST:
        //     return {
        //         ...state,
        //         openLevelSingle: true,
        //         lesson: action.json
        //     };
        // case closeLevelSingle.REQUEST:
        //     return {
        //         ...state,
        //         openLevelSingle: false,
        //         // lessons: (state.lessons || []).map(function (run) {
        //         //     if(){}
        //         // }),
        //         lesson:{}
        //     };
        // case uploadLessonVideo.REQUEST:
        //     return {
        //         ...state,
        //         videoUploadLoading: true,
        //         lessonVideo:{}
        //     };
        // case uploadLessonVideo.PROGRESS:
        //     return {
        //         ...state,
        //         lessonVideoProgress: (action.json || {})
        //     };
        // case uploadLessonVideo.RESPONSE:
        //     if(action.json.success){
        //         return {
        //             ...state,
        //             videoUploadLoading: false,
        //             lessonVideo: action.json.result
        //         };
        //     } else {
        //         return {
        //             ...state,
        //             videoUploadLoading: false
        //         };
        //     }
        // case uploadLessonImage.REQUEST:
        //     return {
        //         ...state,
        //         imageUploadLoading: true,
        //         lessonImage:{}
        //     };
        // case uploadLessonImage.PROGRESS:
        //     return {
        //         ...state,
        //         lessonImageProgress: (action.json || {})
        //     };
        // case uploadLessonImage.RESPONSE:
        //     if(action.json.success){
        //         return {
        //             ...state,
        //             imageUploadLoading: false,
        //             lessonImage: action.json.image
        //         };
        //     } else {
        //         return {
        //             ...state,
        //             imageUploadLoading: false
        //         };
        //     }
        // case deleteLesson.REQUEST:
        //     if(action.json._id){
        //         return {
        //             ...state,
        //             lessons: state.lessons.map( function (run) {
        //                 if(run._id.toString() === action.json._id.toString()){
        //                     run.loading = true;
        //                 }
        //                 return run;
        //             } )
        //         };
        //     } else {
        //         return {
        //             ...state
        //         };
        //     }
        // case deleteLesson.RESPONSE:
        //     if(action.json.success){
        //         return {
        //             ...state,
        //             lessons: (action.json.lessons || []),
        //             all: state.all - 1
        //         };
        //     } else {
        //         if(action.json._id){
        //             return {
        //                 ...state,
        //                 lessons: state.lessons.map( function (run) {
        //                     if(run._id.toString() === action.json._id.toString()){
        //                         run.loading = false;
        //                     }
        //                     return run;
        //                 } ),
        //                 all: state.all - 1
        //             };
        //         } else {
        //             return {
        //                 ...state
        //             };
        //         }
        //     }
        // case searchTeacher.REQUEST:
        //     return {
        //         ...state,
        //         searchTeacherLoader: true
        //     };
        // case searchTeacher.RESPONSE:
        //     return {
        //         ...state,
        //         searchTeacherLoader: false,
        //         searchTeachersResult: (action.json.teachers || [])
        //     };
        // case getLesson.REQUEST:
        //     return {
        //         ...state,
        //         statusEdit: 1
        //     };
        // case getLesson.RESPONSE:
        //     let cats = (action.json.categories || []);
        //     let parents = [];
        //     let hold = [];
        //     cats.map(function (run) {
        //         if(run.parent && run.parent !== '' ){
        //             if(parents.length > 0){
        //                 if(parents.some(ff => ff !== run.parent)){
        //                     parents.push(run.parent);
        //                 }
        //             } else {
        //                 parents.push(run.parent);
        //             }
        //         }
        //     });
        //     cats.map(function (run) {
        //         if(parents.some(ff => ff === run._id)){
        //             hold.push(run);
        //             cats = cats.filter(ss => ss._id !== run._id)
        //         }
        //     });
        //     cats.map(function (run) {
        //         if(!run.parent ){
        //             hold.push(run);
        //             cats = cats.filter(ss => ss._id !== run._id)
        //         }
        //     });
        //     cats.map(function (run) {
        //         hold.map(function (ho) {
        //             if(run.parent === ho._id){
        //                 if(ho.child){
        //                     ho.child.push(run);
        //                 } else {
        //                     ho.child = [run];
        //                 }
        //                 cats = cats.filter(ss => ss._id !== run._id)
        //             }
        //         });
        //     });
        //     return {
        //         ...state,
        //         status: 0,
        //         lessons: (action.json.lessons || []),
        //         categories: (hold || []),
        //         all: (action.json.all || 0),
        //         teacherCount: (action.json.teacherCount || 0),
        //     };
        // case lessonChangeHandler.REQUEST:
        //     return {
        //         ...state,
        //         lesson:{
        //             ...state.lesson,
        //             [action.json.name]:action.json.value
        //         },
        //     };
        // case openLessonModal.REQUEST:
        //     return {
        //         ...state,
        //         openModal: true,
        //         lesson:action.json,
        //         lessonImage:action.json.thumbnail,
        //         lessonSmallImage:action.json.thumbnailSmall,
        //         lessonVideo:action.json.video,
        //         searchTeachersResult:[],
        //         lessonVideoProgress: {},
        //         lessonImageProgress: {},
        //     };
        // case closeLessonModal.REQUEST:
        //     return {
        //         ...state,
        //         openModal: false,
        //         lesson:{},
        //         lessonImage: {},
        //         lessonVideo: {},
        //         lessonVideoProgress: {},
        //         lessonImageProgress: {},
        //         searchTeachersResult:[],
        //     };
        // case submitLesson.REQUEST:
        //     return {
        //         ...state,
        //         submitLessonLoader: true,
        //     };
        // case submitLesson.RESPONSE:
        //     if(action.json.success){
        //         window.location.assign("/merchant");
        //         // if(action.json._id){ // update
        //         //     return {
        //         //         ...state,
        //         //         submitLessonLoader: false,
        //         //         openModal: false,
        //         //         lessons: state.lessons.map(function (run) {
        //         //             if(run._id === action.json._id){
        //         //                 run.category= action.json.data.category;
        //         //                 run.description= action.json.data.description;
        //         //                 run.intro_desc= action.json.data.intro_desc;
        //         //                 run.learn_check_list= action.json.data.learn_check_listArray;
        //         //                 run.thumbnail= action.json.data.lessonImage;
        //         //                 run.thumbnailSmall= action.json.data.lessonSmallImage;
        //         //                 run.video= action.json.data.lessonVideo;
        //         //                 run.featured= action.json.data.featured;
        //         //                 run.price= action.json.data.price;
        //         //                 run.requirements= action.json.data.requirementsArray;
        //         //                 run.sale= action.json.data.sale;
        //         //                 run.teacher= action.json.data.selectedMember;
        //         //                 run.title= action.json.data.title;
        //         //                 run.publish= action.json.data.publish;
        //         //                 run.lvl= action.json.data.lvl;
        //         //                 run.created= action.json.data.created;
        //         //             }
        //         //             return run;
        //         //         })
        //         //     };
        //         // } else { // new
        //         //     let lesson={
        //         //         _id: action.json.data._id,
        //         //         category: action.json.data.category,
        //         //         description: action.json.data.description,
        //         //         intro_desc: action.json.data.intro_desc,
        //         //         learn_check_list: action.json.data.learn_check_listArray,
        //         //         thumbnail: action.json.data.lessonImage,
        //         //         thumbnailSmall: action.json.data.lessonSmallImage,
        //         //         video: action.json.data.lessonVideo,
        //         //         price: action.json.data.price,
        //         //         requirements: action.json.data.requirementsArray,
        //         //         sale: action.json.data.sale,
        //         //         featured: action.json.data.featured,
        //         //         teacher: action.json.data.selectedMember,
        //         //         title: action.json.data.title,
        //         //         publish: action.json.data.publish,
        //         //         lvl: action.json.data.lvl,
        //         //         created: action.json.data.created,
        //         //     };
        //         //     return {
        //         //         ...state,
        //         //         submitLessonLoader: false,
        //         //         openModal: false,
        //         //         all: state.all + 1,
        //         //         lessons:[
        //         //             lesson,
        //         //             ...state.lessons,
        //         //         ],
        //         //     };
        //         // }
        //     } else {
        //         return {
        //             ...state,
        //             submitLessonLoader: false
        //         };
        //     }
        default:
            return state;
    }
};