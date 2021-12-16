import React from 'react';
export default class Terms extends React.Component {
    render() {
        const {
            termsSubmit = function(){return false;}
        } = this.props;
        return (
            <React.Fragment>
                <h5>Үйлчилгээний нөхцөл</h5>
                <p style={{textAlign: 'left'}}>
                    <span>1.</span> Ерөнхий зүйл
                    <br /><br />
                    1.1 Bagsh.mn сайтыг болон түүнд агуулагдаж байгаа бүх текст, фото, график, видео, дизайн, дуу авианы контентууд бүхэлд нь “Амжилт Дотком” ХХК хариуцдаг болно. Хэрэглэгч нь энэхүү журамд нийцүүлэн уг сайтыг хэрэглэх ёстой.
                    Хэрвээ дурдсан нөхцөлүүдийг зөвшөөрөхгүй бол сайтад хандах болон хэрэглэхээс татгалзахыг зөвлөж байна.
                    <br />
                    1.2 “Амжилт Дотком” ХХК нь үйлчилгээний нөхцөлд хүссэн үедээ өөрчлөлт хийх бүрэн эрхтэй. Хийгдсэн өөрчлөлтүүд нь сайтад нийтлэгдсэн мөчөөс хүчин төгөлдөр үйлчилнэ. Хэрэглэгч нь нөхцөлд орсон өөрчлөлтийг нийтлэгдсэнээс хойш хэрэглэвэл хүлээн зөвшөөрсөнд тооцогдоно.
                    <br />
                    1.3 ‘Амжилт Дотком’ ХХК нь сайтын агуулга, үйлчилгээний бүтэц, хэлбэр загвар зэрэгт хүссэн үедээ, хүссэн өөрчлөлт шинэчлэлтээ хийх эрхтэй.
                    <br />
                    1.4 “Багш” гэж цахим сургалтад өөрийн оюуны бүтээл, мэдлэг, туршлагаа bagsh.mn платформ дээр байршуулж буй оюуны өмч эзэмшигч иргэн, хуулийн этгээдийг хэлнэ.
                    <br />
                    1.5 “Контент” гэж сургагч талын оюуны хөдөлмөрийн дүнд бий болсон видео, аудио, поверпойнт гэх мэт төрөл бүрийн форматаар бэлдсэн хичээлүүд.
                    <br />
                    1.6 “Платформ” гэж сургагч талын контентийг байршуулах цахим хэрэглэгдэхүүн.
                    <br />
                    1.7 “Аппликэйшн” гэж хэрэглэгч талын контентийг байршуулах гар утасны цахим хэрэглэгдэхүүн.
                    <br />
                    1.8 “Суралцагч” гэж контент худалдан авч буй хүмүүсийг тус тус ойлгоно.
                    <br />
                    <br />
                    2. Оюуны өмчлөл
                    <br />
                    2.1 Сайтын аливаа контентыг “Амжилт Дотком” ХХК-ийн зөвшөөрөлгүйгээр хувилж тараах, нийтлэх, арилжааны зорилгоор ашиглахыг хориглоно.
                    <br />
                    2.2 Хэрэглэгч нь сайтын аливаа контентыг хуулж, татаж авснаар өмчлөх эрх шилжихгүй гэдгийг анхааруулж байна.
                    <br />
                    2.3 “Амжилт Дотком” ХХК нь тухайн багшийн зөвшөөрөлгүйгээр Bagsh.mn сайтаас өөр газар, өөр байдлаар ашиглахгүй.
                    <br />
                    2.4 “Амжилт Дотком” ХХК-ийн зөвшөөрөлгүйгээр өөр хүмүүс ямар нэг байдлаар Bagsh.mn сайтаас тухайн багшийн контентыг хуулбарлан авсан тохиолдолд бид хариуцлага хүлээхгүй болно. /Учир нь ийм тохиолдол гарч магадгүй/
                    <br />
                    2.5 Шаардлагатай тохиолдолд таны контент дээр Bagsh.mn сайтын лого, бүдэг тэмдэг тавих боломжтой.
                    <br />
                    <br />
                    3. ТАЛУУДЫН ЭРХ ҮҮРЭГ
                    <br />
                    3.1 Хэрэглэгч тал:
                    <br />
                    3.1.1 Хэрэглэгч талд сургалттай холбоотой санал хүсэлт гаргах эрхтэй.
                    <br />
                    3.1.2 Төлбөр төлөх хугацааг хойшлуулсан бол уг тохиролцсон хугацаанд хэрэглэгч тал төлбөрөө төлөх үүрэгтэй.
                    <br />
                    3.1.3 Гэрээнд заасан төлбөр тооцоогоо цаг тухайд нь төлөх үүрэгтэй.
                    <br />
                    3.1.4 Хэрэглэгч тал бүртгүүлэхдээ өөрийн мэдээллийг үнэн зөв бүрэн бөглөх үүрэгтэй.
                    <br />
                    3.1.5 Сургалтын хичээлийг цаг тухайд нь платформд оруулах үүрэгтэй
                    <br />
                    3.2 Хэрэгжүүлэгч тал:
                    <br />
                    3.2.1 Хэрэглэгчийн байршуулж буй контентыг хянах эрхтэй.
                    <br />
                    3.2.2 Хэрэглэгчийг төлбөрөө цаг тухайд нь төлөхийг шаардах эрхтэй.
                    <br />
                    3.2.3 Хэрэгжүүлэгч тал Bagsh.mn платформд байрших хичээлүүдэд ямар ч үед урьдчилан мэдэгдэлгүйгээр өөрчлөлт оруулах эрхтэй.
                    <br />
                    3.2.4 Сургалт чөлөөтэй явагдах нөхцөлийг бүрдүүлэх үүрэгтэй
                </p>
                <button className="btn btn--green btn--with-shadow full-width" onClick={() => termsSubmit()}>
                    Зөвшөөрч байна
                </button>
            </React.Fragment>
        );
    }
}