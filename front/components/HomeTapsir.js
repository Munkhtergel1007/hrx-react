import React, { Component } from "react";
import { connect } from 'react-redux';
import Loader from './include/Loader';
import config, {isPhoneNum, string} from '../config';
import Login from './Login';
import Reset from "./Reset";
import UserHome from "./UserHome";
import * as actions from "../actions/home_actions";
import background from "../../static/images/hrx-home.png";
const reducer = ({ main, home }) => ({ main, home })

class Home extends Component {
     

    constructor(props) {
        super(props);
        this.state = {
            resetForm: false,
            submitting: false,
            success: false,
            activeTab:1,
            first_name: {
                text: '',
                error: false
            },
            last_name: {
                text: '',
                error: false
            },
            username: {
                text: '',
                error: false
            },
            register_id: {
                text: '',
                error: false
            },             
            email: {
                text: '',
                error: false
            },
            password: {
                text: '',
                error: false
            },
            gender: {
                text: '',
                error: false
            }, 
            phone: {
                text: '',
                error: false
            },
            company_name: {
                text: '',
                error: false
            },
            company_email: {
                text: '',
                error: false
            },
            company_number: {
                text: '',
                error: false
            },
            company_website: {
                text: '',
                error: false
            },
            company_domain: {
                text: '',
                error:false
            },
            termsOfUseRequire: {
                error: false
            },
            termsOfUse: false
        }
        document.title = 'Tapsir.com';
    }
    clearModal(){
        this.setState({
            activeTab:1,
            first_name: {
                text: '',
                error: false
            },
            last_name: {
                text: '',
                error: false
            },
            username: {
                text: '',
                error: false
            },
            register_id: {
                text: '',
                error: false
            },
            email: {
                text: '',
                error: false
            },
            password: {
                text: '',
                error: false
            },
            gender: {
                text: '',
                error: false
            },
            phone: {
                text: '',
                error: false
            },
            company_name: {
                text: '',
                error: false
            },
            company_email: {
                text: '',
                error: false
            },
            company_number: {
                text: '',
                error: false
            },
            company_website: {
                text: '',
                error: false
            },
            company_domain: {
                text: '',
                error:false
            },
            termsOfUse: false,
            termsOfUseRequire: {
                error: false
            }
        })
    }
    termsOfUseChange() {
        if(this.state.termsOfUse) {
            this.setState({termsOfUse: false})
        }
        else 
        this.setState({termsOfUse: true})
    }
    continueForm(e){
        e.preventDefault();
        const {
            company_name,
            company_email,
            company_number,
            company_website,
            company_domain,
            
        } = this.state;
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const domainRegex = /^[a-zA-Z0-9]*$/;
        if(string(company_name.text) === '' || !isNaN(company_name.text)){
            this.setState({company_name: {text: company_name.text, error: 'Компанийн нэр оруулна уу'}});
        } else if(company_name.text.trim().length>50){
            this.setState({company_name: {text: company_name.text, error: 'Компанийн нэр хэтэрхий урт байна'}});
        } else

        // if(string(company_email.text) === '' || !isNaN(company_email.text)){
        //     this.setState({company_email: {text: company_email.text, error: 'Имэйл орууна уу нэр оруулна уу'}});
        // } else
        if(isNaN(company_email.text) && string(company_email.text) !== '' && !emailRegex.test(company_email.text)){
            this.setState({company_email: {text: company_email.text, error: 'Имэйл бичиглэл буруу байна'}});
        } else

        if(isNaN(company_number.text) && string(company_number.text) !== '' && !isPhoneNum(company_number.text)){
            this.setState({company_number: {text: company_number.text, error: 'Утасны дугаар буруу байна'}});
        } else

        if(isNaN(company_website.text) && string(company_website.text) !== '' && company_website.text.trim().length>50){
            this.setState({company_website: {text: company_website.text, error: 'Website хэтэрхий урт байна'}});
        } else

        if(string(company_domain.text) === '' || !isNaN(company_domain.text)){
            this.setState({company_domain: {text: company_domain.text, error: 'Компанийн домайн оруулна уу'}});
        } else if(company_domain.text.trim().length<4){
            this.setState({company_domain: {text: company_domain.text, error: 'Компанийн домайн хэтэрхий богино байна'}});
        } else if(company_domain.text.trim().length>20){
            this.setState({company_domain: {text: company_domain.text, error: 'Компанийн домайн хэтэрхий урт байна'}});
        } else if(!domainRegex.test(company_domain.text)){
            this.setState({company_domain: {text: company_domain.text, error: 'Зөвхөн латин үсгээр бичнэ үү'}});
        }

        else {
            this.setState({activeTab: 2});
        }
    }
    submitForm(e) {
        e.preventDefault();
        if(!this.state.submitting){
            const {
                first_name,
                last_name,
                register_id,
                username,
                email,
                gender,
                phone,
                password,
                termsOfUse

            } = this.state;
            const nameRegex = /^[a-zA-Zа-яА-ЯөӨүҮёЁ-]*$/;
            const registerRegex = /^[а-яА-ЯөӨүҮёЁ]{2}[0-9]{8}$/;
            const usernameRegex = /^[0-9a-zA-Z_]*$/;
            const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if(string(last_name.text) === '' || !isNaN(last_name.text)){
                this.setState({last_name: {text: last_name.text, error: 'Овог оруулна уу'}});
            } else if(last_name.text.trim().length>30){
                this.setState({last_name: {text: last_name.text, error: 'Овог хэтэрхий урт байна'}});
            } else if(!nameRegex.test(last_name.text)){
                this.setState({last_name: {text: last_name.text, error: 'Латин болон кирилл үсэг, - оруулна уу'}});
            } else

            if(string(first_name.text) === '' || !isNaN(first_name.text)){
                this.setState({first_name: {text: first_name.text, error: 'Нэр оруулна уу'}});
            } else if(first_name.text.trim().length>30){
                this.setState({first_name: {text: first_name.text, error: 'Нэр хэтэрхий урт байна'}});
            } else if(!nameRegex.test(first_name.text)){
                this.setState({first_name: {text: first_name.text, error: 'Латин болон кирилл үсэг, - оруулна уу'}});
            } else

            if(string(register_id.text) === '' || !isNaN(register_id.text)){
                this.setState({register_id: {text: register_id.text, error: 'Регистрийн дугаараа оруулна уу'}});
            } else if(register_id.text.trim().length>30){
                this.setState({register_id: {text: register_id.text, error: 'Регистрийн дугаар хэтэрхий урт байна'}});
            } else if(!registerRegex.test(register_id.text)){
                this.setState({register_id: {text: register_id.text, error: 'Регистрийн дугаар бичиглэл буруу байна'}});
            } else

            if(string(username.text) === '' || !isNaN(username.text)){
                this.setState({username: {text: username.text, error: 'Нэвтрэх нэр оруулна уу'}});
            } else if(username.text.trim().length<4){
                this.setState({username: {text: username.text, error: 'Нэвтрэх нэр хэтэрхий богино байна'}});
            } else  if(username.text.trim().length>30){
                this.setState({username: {text: username.text, error: 'Нэвтрэх нэр хэтэрхий урт байна'}});
            } else if(!usernameRegex.test(username.text)){
                this.setState({username: {text: username.text, error: 'Латин үсэг, тоо болон _ оруулна уу'}});
            } else

            if(string(email.text) === '' || !isNaN(email.text)){
                this.setState({email: {text: email.text, error: 'Имэйл оруулна уу'}});
            } else if(email.text.trim().length>60){
                this.setState({email: {text: email.text, error: 'Имэйл хэтэрхий урт байна'}});
            } else if(!emailRegex.test(email.text)){
                this.setState({email: {text: email.text, error: 'Имэйл бичиглэл буруу байна'}});
            } else

            if(!phone.text){
                this.setState({phone: {text: phone.text, error: 'Утасны дугаар оруулна уу'}});
            } else if(!isPhoneNum(phone.text)){
                this.setState({phone: {text: phone.text, error: 'Утасны дугаар буруу байна'}});
            } else

            if(!password.text){
                this.setState({password: {text: password.text, error: 'Нууц үг оруулна уу'}});
            } else if(password.text.trim().length<8){
                this.setState({password: {text: password.text, error: 'Доод тал нь 8 оронтой'}});
            } else  if(password.text.trim().length>30){
                this.setState({password: {text: password.text, error: 'Нууц үг хэтэрхий урт байна'}});
            } else if(string(gender.text) === '' || !isNaN(gender.text)){
                this.setState({gender: {text: gender.text, error: 'Хүйс сонгоно уу'}});
            }
            else if(!termsOfUse) {
                this.setState({termsOfUseRequire: {error: 'Та манай үйлчилгээний нөхцөлтэй танилцна уу.' }})
            }
            else {
                let cc = {
                    company_name: this.state.company_name.text,
                    company_email: this.state.company_email.text,
                    company_number: this.state.company_number.text,
                    company_website: this.state.company_website.text,
                    company_domain: this.state.company_domain.text,
                    last_name: this.state.last_name.text,
                    first_name: this.state.first_name.text,
                    register_id: this.state.register_id.text,
                    username: this.state.username.text,
                    email: this.state.email.text,
                    phone: this.state.phone.text,
                    password: this.state.password.text,
                    gender: this.state.gender.text,
                };
                this.setState({submitting: true}, () => {
                    this.props.dispatch(actions.registerCompanyAndUser(cc))
                        .then((c) => {
                            let state = {submitting: false};
                            if(c.json.success){
                                // this.setState(state);
                                // let url = config.get('redirectHostHead')+ c.json.company.domain +'.' + config.get('redirectHostTail');
                                let url = config.get('host')
                                window.location.assign(url);
                            } else {
                                (c.json.errorData || []).map(function (r) {
                                    if((Object.keys(r) || [])[0] === 'company_domain'){
                                        state = {...state, activeTab:1};
                                    }
                                    state = {...state, [(Object.keys(r) || [])[0]]:r[Object.keys(r)[0]]};
                                });
                                this.setState(state);
                            }
                        });
                });
            }
        }

    }
    butsah(e){
        e.preventDefault();
        if(!this.state.submitting){
            this.setState({activeTab: 1})
        }
    }
    
    render() {
        const {main:{user, companies}} = this.props;
        return (
            <React.Fragment> 
               
                { user && user._id ? 
                    <>
                    <UserHome />
                    </>
                    :
                    <div className="hrxHome" style={{backgroundImage: `url(${background})`}}>
                        <div className="tapsirNav">
                            <img className="tapsirLogo" src="/images/tapsir.png" alt="" />
                            <button className="tapsirLoginButton">КIРУ</button>
                        </div>


                    {/* <Login />
                    <Reset /> */}
                    <div class="modal fade" id="termsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" style={{backgroundColor: 'rgba(0,0,0,0.9)'}}>
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle">Үйлчилгээний нөхцөл</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <h6>I. Нийтлэг үндэслэл</h6>
                                <p>
                                1.1. HRX хүний нөөцийн мэдээллийн систем нь (цаашид “Систем” гэх) Амжилт 
                                Дотком ХХК-ийн (цаашид “Үйлчилгээ үзүүлэгч” гэх) албан ёсны үйлчилгээ
                                мөн бөгөөд энэхүү үйлчилгээний нөхцлийн зорилго нь хэрэглэгч (цаашид 
                                “Хэрэглэгч” гэх) системийг ашиглахтай холбогдон үүсэх аливаа харилцааг 
                                зохицуулахад оршино.
                                </p>
                                <p>
                                1.2. Үйлчилгээний нөхцөлд дурдсан дараах нэр томъёонуудыг дор дурдсан 
                                утгаар ойлгоно. Үүнд:
                                <br/>- “Үйлчилгээ үзүүлэгч” гэж “Амжилт Дотком” ХХК-ийг;<br/>
                                - “Систем” гэж хүний нөөцийн мэдээллийн систем tatatunga.mn платформыг;<br/>
                                - “Системийн админ” гэж өгөгдлийн санд нэвтрэх эрх бүхий үйлчилгээ
                                үзүүлэгч байгууллагын ажилтныг;<br/>
                                - “Хэрэглэгч хувь хүн” гэж үйлчилгээний нөхцлийг хүлээн зөвшөөрч,
                                системийг хэрэглэж буй хувь хүнийг;<br/>
                                - “Хэрэглэгч байгууллага” гэж үйлчилгээний нөхцлийг хүлээн зөвшөөрч, 
                                системийг хэрэглэж буй аж ахуйн нэгж, байгууллага болон хуулийн 
                                этгээдийг;<br/>
                                - “Хэрэглэгч” гэж хэрэглэгч хувь хүн болон хэрэглэгч байгууллагыг хамтад 
                                нь тус тус тодорхойлно.
                                </p>
                                <p>
                                1.3. Хэрэглэгч үйлчилгээний нөхцлийг хүлээн зөвшөөрч, батагаажуулснаар 
                                системд өөрийн бүртгэлийг үүсгэж, ашиглах эрхтэй болно.
                                1.4. Хэрэглэгч системд өөрийн бүртгэлийг үүсгэн ашиглаж эхэлсэн цагаас
                                хэрэглэгчийн бүртгэл хаагдах хүртэлх хугацаанд үйлчилгээний нөхцөл хүчин 
                                төгөлдөр үйлчилнэ.
                                </p>
                                <p>1.5. Нэг хэрэглэгч системд цор ганц бүртгэлтэй байна.</p>
                                
                                {/*<p>1.6. Системийн нэр, лого, загвар, бүтэц схем, түүний програм, код нь “Амжилт */}
                                {/*Дотком” ХХК-ийн оюуны өмчөөр баталгаажсан бүтээл бөгөөд эзэмшигчийн */}
                                {/*зөвшөөрөлгүйгээр хуулбарлах, дуурайх, олшруулах, өөр бусад ямар нэгэн*/}
                                {/*зүйлд ашиглахыг хориглоно. /оюуны өмчөөр баталгаажуулна/</p>*/}
                                <p>1.6. Үйлчилгээ үзүүлэгчийн сервер компьютер нь системийн хамгаалалт,
                                нууцлал, аюулгүй байдал, найдвартай ажиллагаагаар хангагдсан “Үндэсний
                                Дата Төв”-ийн дэд бүтцийг ашиглана.</p>
                                <p>1.7. Үйлчилгээ үзүүлэгч нь хэрэглэгч байгууллагын бизнесийн нууц мэдээлэлд
                                хууль бусаар болон зөвшөөрөлгүйгээр хандах, гуравдагч талд алдах, устгах, 
                                өөрчлөхөөс сэргийлж техникийн болон менежментийн хамгаалалтын арга 
                                хэмжээнүүдийг авч ажилладаг ба тогтмол хяналтаас үл хамааран учирч болох 
                                аюул эрсдэл, цахим халдлагаас бүрэн хамгаалах боломжгүй гэдгийг талууд
                                харилцан тохиролцож, зөвшөөрсөн болно</p>
                                <p>1.8. Үйлчилгээний нөхцлийн хэрэгжилтэд үйлчилгээ үзүүлэгч болон хэрэглэгч
                                талууд хамтран хяналт тавина.</p>
                                <h6>II. Үйлчилгээ үзүүлэгчийн эрх, үүрэг</h6>
                            <p>
                                <b>2.1. Үйлчилгээ үзүүлэгч дараах үүргүүдийг хүлээнэ. </b> Үүнд: 
                            </p>
                                <p>2.1.1. Үйлчилгээ үзүүлэгч нь системийн хөгжүүлэлт, тасралтгүй 
                                ажиллагааны найдвартай байдлыг хангаж ажиллах үүрэгтэй.</p>
                                <p>2.1.2. Үйлчилгээ үзүүлэгч нь систем ашиглах заавар зөвлөмж, шинээр 
                                хөгжүүлэгдсэн нэмэлт боломжуудын талаар болон системтэй 
                                холбоотой бусад мэдээллээр хэрэглэгчийг хангах, тусламж 
                                үйлчилгээ үзүүлэх үүрэгтэй.</p>
                                <p>2.1.3. Системийн өргөтгөл, шинэчлэлт, өөрчлөлт хийсэнтэй 
                                холбоотойгоор хэрэглэгчийн мэдээлэл өөрчлөгдсөн, устсан 
                                тохиолдолд үйчилгээ үзүүлэгч хариуцлага хүлээх ба асуудалыг 
                                шийдвэрлэхэд оролцогч талууд хамтран ажиллана.</p>
                                <p>
                                2.1.4. Үйлчилгээ үзүүлэгч нь хэрэглэгчийн зөвшөөрөлгүйгээр 
                                хэрэглэгчийн мэдээллийг гуравдагч этгээдэд дамжуулахгүй байх 
                                үүрэгтэй.
                                </p>
                                <p>2.1.5. Үйлчилгээ үзүүлэгч нь хуулиар тусгайлан олгогдсон онцгой эрх 
                                бүхий байгууллага, албан тушаалтны хуулийн дагуух шаардлагын 
                                үүднээс өгөгдлийн сангаас мэдээлэл хянах, гаргуулах үүрэгтэй 
                                бөгөөд энэ талаар холбогдох хэрэглэгчид мэдэгдэнэ.</p>
                                <p>2.1.6. Үйлчилгээ үзүүлэгч нь хэрэглэгчийн интернэт холболтоос үүдсэн 
                                системийн асуудлыг хариуцахгүй.</p>
                                <p>2.1.7. Систем нь байгалийн давагдашгүй хүчин зүйл буюу гал, үер, газар 
                                хөдлөлт, аянга, тэсрэлт, гоц халдварт өвчнөөс эсвэл төрийн эрх
                                бүхий байгууллагаас гаргасан хуулийн зохицуулалт, дүрэм, журам, 
                                хэрэгжүүлсэн үйл ажиллагаа, ажил хаялт, дайн зэрэгтэй 
                                холбоотойгоор тасалдвал түүнийг үйлчилгээний тасалдалд 
                                тооцохгүй бөгөөд үйлчилгээ үзүүлэгчийн хариуцлага хүлээх 
                                үндэслэл болохгүй. </p>
                                
                                <p>
                                    <b> 2.2. Үйлчилгээ үзүүлэгч нь дараах эрхүүдийг эдэлнэ. </b> Үүнд:
                                </p>
                                <p>2.2.1. Үйлчилгээ үзүүлэгч нь үйлчилгээний нөхцөлд өөрчлөлт оруулах, 
                                шинэчлэлт хийх эрхтэй.</p>
                                <p>
                                2.2.2. Системийн админ нь зөвхөн шаардлагатай тохиолдолд 
                                хэрэглэгчийн өгөгдлийн санд хандаж тодорхой өгөгдөлд өөрчлөлт 
                                оруулах, хасах эрхтэй ба холбогдогч талд урьдчилан мэдэгдэнэ.
                                </p>
                                <p>
                                2.2.3. Хэрэглэгч үйлчилгээний нөхцлөөр хүлээсэн үүргээ биелүүлээгүй 
                                буюу хангалтгүй биелүүлсэн, үүргээ зөрчсөн, системийн 
                                үйлчилгээг хууль бусаар ашигласан, үйлчилгээ үзүүлэгчид болон 
                                бусад хэрэглэгчид хохирол учруулсан нь батлагдсан тохиололд 
                                үйлчилгээ үзүүлэгч нь ямар нэгэн хязгаарлалтгүйгээр тухайн 
                                хэрэглэгчид үйлчилгээ үзүүлэхээс татгалзах, бүртгэлийг хаах
                                эрхтэй.
                                </p>

                                <h6>III. Хэрэглэгчийн эрх, үүрэг</h6>
                                <p>
                                    <b>3.1. Хэрэглэгч дараах үүргүүдийг хүлээнэ. </b>
                                Үүнд:
                                <p>
                                3.1.1. Хэрэглэгч системд бүртгэл үүсгэхдээ мэдээллээ үнэн зөв, алдаагүй, 
                                бүрэн оруулах үүрэгтэй.
                                </p>
                                <p>
                                3.1.2. Хэрэглэгч өөрийн нэвтрэх нэр, нууц үгийг бусдад дамжуулахгүй 
                                байх, түүнтэй холбоотойгоор учирч болох аливаа эрсдлээс 
                                урьдчилан сэргийлэх үүрэгтэй.
                                </p>
                                <p>
                                3.1.3. Хэрэглэгч байгууллага нь хэрэглэгч хувь хүний бүртгэлийг 
                                үүсгэсэн тохиолдолд үйлчилгээний нөхцөлтэй танилцуулах, 
                                системд нэвтрэх нууц үгийг гуравдагч этгээдэд задруулахгүй байх, 
                                системд нэвтрэх нууц үгээ солихыг хэрэглэгч хувь хүнд сануулах 
                                үүрэгтэй.
                                </p>
                                <p>
                                3.1.4. Хэрэглэгч хувь хүн нь хэрэглэгч байгууллагаар дамжуулан бүртгэл 
                                үүсгүүлсэн тохиолдолд системд нэвтрэх нууц үгээ солих үүрэгтэй.
                                </p>
                                <p>3.1.5. Хэрэглэгч нь системийн ямар нэгэн алдаа илрүүлсэн тохиолдолд 
                                үйлчилгээ үзүүлэгчид зайлшгүй мэдээлэх үүрэгтэй.</p>
                                <p>3.1.6. Хэрэглэгч нь үйлчилгээ үзүүлэгчийн системийн сүлжээ, серверт 
                                хууль бусаар халдах, эвдрэл саатал, гэмтэл хохирол учруулах 
                                оролдого хийхгүй байх үүрэгтэй. </p>
                                
                                3.1.7. Хэрэглэгч нь системийг ашиглан хийсэн бүхий л үйлдэлдээ 
                                хариуцлага хүлээнэ.
                                3.1.8. Үүргээ биелүүлээгүй буюу хангалтгүй биелүүлсний улмаас
                                учирсан аливаа хохирлыг хэрэглэгч өөрөө бүрэн хариуцна.
                                </p>
                                <b>3.2. Хэрэглэгч дараах эрхүүдийг эдэлнэ. </b>Үүнд:
                                <p>
                                3.2.1. Хэрэглэгч нь ажлын өдрүүдийн 10:00-18:00 цагийн хооронд
                                тодорхой сувгаар үйлчилгээ үзүүлэгчтэй холбогдож, системийг 
                                ашиглах заавар зөвлөмж, тайлбар мэдээлэл авах эрхтэй.
                                </p>
                                <p>3.2.2. Хэрэглэгч нь систем болон үйлчилгээтэй холбоотой санал хүсэлтээ 
                                үйлчилгээ үзүүлэгчид чөлөөтэй илэрхийлэх эрхтэй.</p>
                                <p>
                                3.2.3. Хэрэглэгч нь системийг ашиглахаа болих эрхтэй ба энэ тохиолдолд 
                                хэрэглэгчийн бүртгэлээ устгах шаардлагатай.
                                </p>

                                <h6>IV. Төлбөртөй үйлчилгээ</h6>
                                <p>
                                4.1. Системд бүртгүүлсэн хэрэглэгч байгууллагууд системийн санал болгож буй 
                                үндсэн боломжуудыг “үнэ төлбөргүй” ашиглана.
                                </p>
                                <h6>V. Үйлчилгээний нөхцөлд өөрчлөлт оруулах</h6>
                                <p>
                                5.1. Үйлчилгээ үзүүлэгч нь үйлчилгээний нөхцлийн тодорхой заалтыг шууд 
                                хэрэгжих нөхцлөөр өөрчлөх, заалт нэмэх эрхтэй бөгөөд өөрчлөлт оруулахдаа 
                                хэрэглэгчид урьдчилан сануулах, анхааруулахгүй байж болно.
                                </p>
                                <p>
                                5.2. Үйлчилгээний нөхцлийг шинэчилж, өөрчилсөн тохиолдолд шинэчлэгдсэн
                                хувилбар нь систем дээр байршина.
                                </p>
                                
                                <h6>VI. Бусад</h6>
                                <p>
                                6.1. Системийн үйлчилгээ, үйл ажиллагаатай холбоотой ирүүлсэн аливаа 
                                гомдлыг хүлээн авсан өдрөөс хойш ажлын 5 хоногийн дотор хэлэлцэж, хариу 
                                өгнө.
                                </p>
                                
                                <p style={{marginLeft: 100}}>
                                    <br/>
                                Үүсгэсэн огноо: 2021 оны 8 сарын 2. <br/>
                                Сүүлд шинэчлэгдсэн огноо: 2021 оны 8 сарын 3.
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button style={{position: "relative", height: 35}} className="crumina-button button--dark landingButton submitButton"
                                        onClick={()=> this.termsOfUseChange()} data-dismiss="modal" data-toggle="modal" data-target="#right-menu">
                                    {
                                        this.state.termsOfUse ?
                                            'ТАТГАЛЗАХ'
                                            :
                                            'ЗӨВШӨӨРӨХ'
                                    }
                                </button>
                                <button  className="returnButton crumina-button" style={{ width: 135, height: 35}} data-dismiss="modal"
                                data-toggle="modal" data-target="#right-menu">
                                    ХААХ</button>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade window-popup right-menu-popup" id="right-menu" tabindex="-1" role="dialog"
                        aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="right-menu" style={{minHeight: '100vh'}}>
                                        <div className="user-menu-close" data-dismiss="modal">
                                            <div className="user-menu-content">
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <div className="widget w-info">
                                            <a className="site-logo" href="/" style={{display: 'flex', justifyContent: 'center'}}>
                                                <img loading="lazy" src="/images/hrx-logo.png" alt="logo" width="120"/>
                                            </a>
                                            <p className="widget-text" style={{marginBottom: -10}}>
                                                Дараах мэдээллийг бүрэн бөглөснөөр бүртгэлийн хүсэлт илгээгдэнэ.<br/>
                                                *Таны үүсгэж буй бүртгэл байгууллагын толгой бүртгэл болохыг анхаарна уу
                                            </p>
                                        </div>
                                        <div className="widget w-login">
                                            {
                                                this.state.success ?
                                                    <div style={{
                                                        textAlign: 'center',
                                                        backgroundColor: '#f7f7f7',
                                                        padding: '15px 20px',
                                                        borderRadius: '10px',
                                                        margin: '80px auto',
                                                    }}>
                                                        <b>"{this.state.full_name.text}"</b> таны бүртгэл амжилттай үүслээ!
                                                        <h5 style={{margin: 0}}>Бид тантай эргэн холбогдох болно.</h5>
                                                    </div>
                                                :
                                                    <React.Fragment>
                                                        <div className="bloc-tabs">
                                                            <div className={this.state.activeTab === 1 ? "tabs active-tabs" : "tabs"} ><h6 className="widget-title">Компанийн мэдээлэл</h6></div>
                                                            <div className={this.state.activeTab === 2 ? "tabs active-tabs" : "tabs"} ><h6 className="widget-title">Хувийн мэдээлэл</h6></div>

                                                        </div>
                                                        <div className="content-tabs">
                                                            <div className={this.state.activeTab === 1 ? "content active-content" : "contentTab"}>
                                                                <form onSubmit={(e) => this.state.submitting ? false : this.submitForm(e)}>
                                                                    <div className="form-item">
                                                                        <input className="homeInput"
                                                                            style={this.state.company_name.error ? {
                                                                                border: '2px solid #e0393985',
                                                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                height: 50
                                                                            } : {height: 50}}
                                                                            placeholder="Компани нэр"
                                                                            type="text"
                                                                            value={this.state.company_name && this.state.company_name.text ? this.state.company_name.text : ''}
                                                                            onChange={(e) => this.setState({company_name: {text: e.target.value, error: false}})}
                                                                        />
                                                                        {this.state.company_name.error ?
                                                                            <div className="displayState">{this.state.company_name.error}</div>
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                    <div className="form-item">
                                                                        <input className="homeInput"
                                                                            style={this.state.company_email.error ? {
                                                                                border: '2px solid #e0393985',
                                                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                height: 50
                                                                            } : {height: 50}}
                                                                            placeholder="Имэйл хаяг /Компани/"
                                                                            type="text"
                                                                            value={this.state.company_email && this.state.company_email.text ? this.state.company_email.text : ''}
                                                                            onChange={(e) => this.setState({company_email: {text: e.target.value, error: false}})}
                                                                        />
                                                                        {this.state.company_email.error ?
                                                                            <div className="displayState">{this.state.company_email.error}</div>
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                    
                                                                    <div className="form-item">
                                                                        <input className="homeInput"
                                                                            value={this.state.company_number && this.state.company_number.text ? this.state.company_number.text : ''}
                                                                            style={this.state.company_number.error ? {
                                                                                border: '2px solid #e0393985',
                                                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                height: 50
                                                                            } : {height: 50}}
                                                                            placeholder="Утас /Компани/" type="text" onChange={(e) => this.setState({company_number: {text: e.target.value, error: false}})}
                                                                        />
                                                                        {this.state.company_number.error?
                                                                            <div className="displayState">{this.state.company_number.error}</div>
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                    
                                                                    <div className="form-item">
                                                                        <input className="homeInput"
                                                                            style={this.state.company_website.error ? {
                                                                                border: '2px solid #e0393985',
                                                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                height: 50
                                                                            } : {height: 50}}
                                                                            placeholder="Website"
                                                                            type="text"
                                                                            value={this.state.company_website && this.state.company_website.text ? this.state.company_website.text : ''}
                                                                            onChange={(e) => this.setState({company_website: {text: e.target.value, error: false}})}
                                                                        />
                                                                        {this.state.company_website.error ?
                                                                            <div className="displayState">{this.state.company_website.error}</div>
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                    <div className="form-item domain">
                                                                        <span id="http">https://</span>
                                                                        <input className="homeInput"
                                                                            style={this.state.company_domain.error ? {
                                                                                border: '2px solid #e0393985',
                                                                                boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                height: 50
                                                                            } : {height: 50}}
                                                                            placeholder="Domain"
                                                                            type="text"
                                                                            value={this.state.company_domain && this.state.company_domain.text ? this.state.company_domain.text : ''}
                                                                            id="domain"
                                                                            onChange={(e) => this.setState({company_domain: {text: e.target.value, error: false}})}
                                                                        />
                                                                        <span id="hrx">.tatatunga.mn</span>
                                                                    </div>
                                                                    {this.state.company_domain.error?
                                                                        <div className="displayState" style={{position:'relative', top:-20}}>{this.state.company_domain.error}</div>
                                                                        :
                                                                        null
                                                                    }
                                                                    
                                                                    

                                                                    <div className="form-item buttonDiv" style={{
                                                                        position: 'absolute',
                                                                        bottom: '35px',
                                                                    }}>
                                                                        <button style={{backgroundColor: (this.state.submitting ? '#313759ab' : '#313759'), border: '2px solid #313759'}} className=" crumina-button landingButton modalButton"
                                                                        onClick={this.continueForm.bind(this)}>ҮРГЭЛЖЛҮҮЛЭХ</button>
                                                                    </div>
                                                            </form>
                                                        </div>
                                                            
                                                                <div className={this.state.activeTab === 2 ? "content active-content" : "contentTab"} >
                                                                    <form onSubmit={(e) => this.submitForm(e)}>
                                                                        <div className="names">
                                                                            <div className="form-item" id="name1">
                                                                                <input className="homeInput"
                                                                                    style={this.state.last_name.error ? {
                                                                                        border: '2px solid #e0393985',
                                                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                        height: 50
                                                                                    } : {height: 50}}
                                                                                    placeholder="Овог"
                                                                                    type="text"
                                                                                    value={this.state.last_name && this.state.last_name.text ? this.state.last_name.text : ''}
                                                                                    onChange={(e) => this.setState({last_name: {text: e.target.value, error: false}})}
                                                                                />
                                                                                {this.state.last_name.error ?
                                                                                    <div className="displayState">{this.state.last_name.error}</div>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </div>
                                                                            <div className="form-item " id="name2">
                                                                                <input className="homeInput"
                                                                                    style={this.state.first_name.error ? {
                                                                                        border: '2px solid #e0393985',
                                                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                        height: 50
                                                                                    } : {height: 50}}
                                                                                    placeholder="Нэр"
                                                                                    type="text"
                                                                                    value={this.state.first_name && this.state.first_name.text ? this.state.first_name.text : ''}
                                                                                    onChange={(e) => this.setState({first_name: {text: e.target.value, error: false}})}
                                                                                />
                                                                                {this.state.first_name.error ?
                                                                                    <div className="displayState">{this.state.first_name.error}</div>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="form-item" id="register_id">
                                                                            <input className="homeInput"
                                                                                style={this.state.register_id.error ? {
                                                                                    border: '2px solid #e0393985',
                                                                                    boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                    height: 50
                                                                                } : {height: 50}}
                                                                                placeholder="Регистрийн дугаар"
                                                                                type="text"
                                                                                value={this.state.register_id && this.state.register_id.text ? this.state.register_id.text : ''}
                                                                                onChange={(e) => this.setState({register_id: {text: e.target.value, error: false}})}
                                                                            />
                                                                            {this.state.register_id.error ?
                                                                                <div className="displayState">{this.state.register_id.error}</div>
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>
                                                                        
                                                                        <div className="form-item">
                                                                            <input className="homeInput"
                                                                                style={this.state.username.error ? {
                                                                                    border: '2px solid #e0393985',
                                                                                    boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                    height: 50
                                                                                } : {height: 50}}
                                                                                placeholder="Нэвтрэх нэр"
                                                                                type="text"
                                                                                value={this.state.username && this.state.username.text ? this.state.username.text : ''}
                                                                                onChange={(e) => this.setState({username: {text: e.target.value, error: false}})}
                                                                            />
                                                                            {this.state.username.error ?
                                                                                <div className="displayState">{this.state.username.error}</div>
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>
                                                                        
                                                                        <div className="form-item">
                                                                            <input className="homeInput"
                                                                                style={this.state.email.error ? {
                                                                                    border: '2px solid #e0393985',
                                                                                    boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                    height: 50
                                                                                } : {height: 50}}
                                                                                placeholder="Имэйл хаяг"
                                                                                type="text"
                                                                                value={this.state.email && this.state.email.text ? this.state.email.text : ''}
                                                                                onChange={(e) => this.setState({email: {text: e.target.value, error: false}})}
                                                                            />
                                                                            {this.state.email.error ?
                                                                                <div className="displayState">{this.state.email.error}</div>
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>
                                                                        <div className="names">
                                                                            <div className="form-item">
                                                                                <input className="homeInput"
                                                                                    value={this.state.phone && this.state.phone.text ? this.state.phone.text : ''}
                                                                                    style={this.state.phone.error ? {
                                                                                        border: '2px solid #e0393985',
                                                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                        height: 50
                                                                                    } : {height: 50}}
                                                                                    placeholder="Утасны дугаар" type="text" onChange={(e) => this.setState({phone: {text: e.target.value, error: false}})}
                                                                                />
                                                                                {this.state.phone.error ?
                                                                                    <div className="displayState">{this.state.phone.error}</div>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </div>
                                                                            <div className="form-item"
                                                                                id="password"
                                                                            >
                                                                                <input className="homeInput"
                                                                                    style={this.state.password.error ? {
                                                                                        border: '2px solid #e0393985',
                                                                                        boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                        height: 50
                                                                                    } : {height: 50}}
                                                                                    placeholder="Нууц үг"
                                                                                    type="password"
                                                                                    value={this.state.password && this.state.password.text ? this.state.password.text : ''}
                                                                                    onChange={(e) => this.setState({password: {text: e.target.value, error: false}})}
                                                                                />
                                                                                {this.state.password.error ?
                                                                                    <div className="displayState">{this.state.password.error}</div>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-item">
                                                                            <select 
                                                                                value={this.state.gender && this.state.gender.text ? this.state.gender.text : ''}
                                                                                style={this.state.gender.error ? {
                                                                                    border: '2px solid #e0393985',
                                                                                    boxShadow: '0 10px 20px 0 rgba(205, 67, 39, .26)',
                                                                                    height: 50
                                                                                } : {height: 50}}
                                                                                name="gender" className="gender homeInput" onChange={(e) => this.setState({gender: {text: e.target.value, error: false}})}
                                                                            >
                                                                                <option disabled selected value='' style={{display:"none"}}> Хүйс </option>
                                                                                <option value="male">Эрэгтэй</option>
                                                                                <option value="female">Эмэгтэй</option>
                                                                            </select>
                                                                            {this.state.gender.error ?
                                                                                <div className="displayState">{this.state.gender.error}</div>
                                                                                :
                                                                                null
                                                                            }
                                                                        </div>

                                                                        <div className="termsOfUse">
                                                                            <button className="termsButton" onClick={()=> this.termsOfUseChange()}>
                                                                                {
                                                                                    this.state.termsOfUse ?
                                                                                    <ion-icon name="checkbox" style={{
                                                                                        color: '#7952B3',
                                                                                        fontSize: '24px',
                                                                                        position: 'absolute',
                                                                                        marginTop: '-12px',
                                                                                        marginLeft: '-12px',
                                                                                        transition: '0.2s'
                                                                                    }}></ion-icon>
                                                                                    :
                                                                                    null
                                                                                }
                                                                            </button>
                                                                        
                                                                            <div className="fontsizeSmall" style={ this.state.termsOfUseRequire.error ? 
                                                                                {fontWeight: 600,
                                                                                color: '#f8513c',
                                                                                textShadow: '0px 3px 12px #f8513c',
                                                                                opacity: '0.9'}
                                                                                :
                                                                                {}}> Би энэхүү <a
                                                                                    className="termsAnchor"
                                                                                    data-toggle="modal"
                                                                                    data-target="#termsModal"
                                                                                    data-dismiss="modal"
                                                                                    data-backdrop="false"
                                                                                    data-keyboard="false"
                                                                            > үйлчилгээний нөхцөлийг</a> зөвшөөрч байна.
                                                                            </div>
                                                                            
                                                                        </div>
                                                                        
                                                                        
                                                                        
                                                                        <div className="form-item buttons">
                                                                        <button  className="returnButton crumina-button modalButton returnModalWidth"
                                                                        onClick={(e) => this.butsah(e)}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
                                                                        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                                                                        </svg>БУЦАХ</button>
                                                                        <button style={{position: "relative"}} className="crumina-button landingButton submitButton modalButton"> 
                                                                            {
                                                                                this.state.submitting ? <> <i class="fa fa-circle-o-notch fa-spin loading"/> БҮРТГҮҮЛЭХ </>
                                                                                :
                                                                                "БҮРТГҮҮЛЭХ"
                                                                            } </button>
                                                                        </div>

                                                                    </form>
                                                                </div>

                                                            </div>
                                                                                                    
                                                    </React.Fragment>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                




                    <div className="main-content-wrapper" >
                        <div className="listBackground">
                            <h4 className="secTitle">Жүйелік модуль </h4>
                            <div className="doneList">
                                <div className="listItemHome" style={{width: 245}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Қызметкердің сауалнамасы</span>
                                </div>
                                <div className="listItemHome" style={{width: 140}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Уақыт тіркеу</span>
                                </div>
                                <div className="listItemHome" style={{width: 215}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Қызмет сипаттамасы</span>
                                </div>
                                <div className="listItemHome" style={{width: 190}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}> Өнімділікті басқару</span>
                                </div>
                                <div className="listItemHome" style={{width: 190}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Жалақыны басқару</span>
                                </div>
                                <div className="listItemHome" style={{width: 175}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Бақылау тақтасы</span>
                                </div>
                                <div className="listItemHome" style={{width: 340}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Кірістер мен шығыстар (Tіркеу, Бақылау) </span>
                                </div>
                                <div className="listItemHome" style={{width: 120}}>
                                    <div className="listIcon">
                                        <ion-icon style={{color:'#a3de02', fontSize: 30}} name="checkmark-circle"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13}}>Есеп беру</span>
                                </div>
                            </div>
                            <div className="notDoneList">
                                <div className="listItemHome" style={{width: 150, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Кері байланыс </span>
                                </div>
                                
                                <div className="listItemHome" style={{width: 240, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Бейімделу бағдарламасы</span>
                                </div>
                                <div className="listItemHome" style={{width: 195, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Еңбек қатынастары</span>
                                </div>
                                <div className="listItemHome" style={{width: 205, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Жұмыс орнын талдау</span>
                                </div>
                                <div className="listItemHome" style={{width: 200, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Кадрлық жоспарлау</span>
                                </div>
                                <div className="listItemHome" style={{width: 260, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Ұйымдық құрылым картасы</span>
                                </div>
                                <div className="listItemHome" style={{width: 155, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Сауалнама алу</span>
                                </div>
                                <div className="listItemHome" style={{width: 145, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Ақылды есеп</span>
                                </div>
                                <div className="listItemHome" style={{width: 190, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Позиция дәрежесі</span>
                                </div>
                                <div className="listItemHome" style={{width: 210, backgroundColor: '#F2E8E9'}}>
                                    <div className="listIcon" style={{backgroundColor: '#f5f7b2'}}>
                                        <ion-icon style={{color:'#8c6cb2'}} name="hourglass"></ion-icon>
                                    </div>
                                        <span style={{marginLeft: 13, color: '#23232A'}}>Мансапты жоспарлау</span>
                                </div>

                            </div>
                            
                        </div>
                        <div className="hrxContact">
                            <div><ion-icon name="mail-open"></ion-icon>&nbsp; info@tapsir.com</div>
                            <div className="contactMargin"><ion-icon name="call"></ion-icon>&nbsp; +976 9431 6060</div>
                        </div>
                        <div className="development">
                                        <span>Жүйені тоқтаусыз дамытудамыз.</span>    
                        </div>
                        <div>
                            <h3 className="secTitle">Ұйым жұмысын жүйелендіру. </h3>
                            <h1 className="secTitle">
                                &nbsp;&nbsp;&nbsp;&nbsp; ҰЙЫМДЫ ТҰТАСТАЙ 
                                <br/>
                                БАСҚАРУ ЖҮЙЕСI
                            </h1>
                            <div className="mainButtonHome">
                                <div className="freeBanner">
                                        FREE
                                </div>
                                <button className="signUpButton" >
                                    ТІРКЕЛУ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                }
                
            </React.Fragment>
        );
    }
}

export default  connect(reducer)(Home);

