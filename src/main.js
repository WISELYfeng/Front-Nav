let $siteList = $('.siteList')
const $lastLi = $siteList.find('li.addBtn')
const url = localStorage.getItem('urlString')
const urlObj = JSON.parse(url)
let hashMap = urlObj || [
    {'url':'https://www.bilibili.com','logo':'B'}
]


const uniqueArray = (array) => {
    let result = {}
    let finalArr = []
    array.forEach((item,index) => {
        result[array[index].url] = item
    })
    for(item in result){
        finalArr.push(result[item])
    }
    return finalArr
}

const simplyUrl = (url) => {
    return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '')
}

const render = ()=> {
    $siteList.find('li:not(.addBtn)').remove()
    hashMap.forEach( (item, index) => {
        const $li = $(`
            <li>
                <div class="site">
                    <div class="logo">${item.logo}</div>
                    <div class="link">${simplyUrl(item.url)}</div>
                    <div class="close">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-close"></use>
                        </svg>
                    </div>
                </div>
            </li>
        `).insertBefore($lastLi)
        $li.on('click', (e) => {
            window.open(item.url)
        })
        $li.on('click', '.close', (e) => {
            e.stopPropagation()  // 阻止冒泡跳转url
            hashMap.splice(index,1)
            render()
        })
    })
}


render()

$('.addButton').on('click',()=>{
    let url = window.prompt("请问你要添加的网站网址是什么？")
    if(url.indexOf('http') !== 0){
        url = 'https://' + url
    }
    hashMap.push({
        logo:simplyUrl(url)[0].toUpperCase(),
        url:url
    })
    const lastLen = hashMap.length
    hashMap = uniqueArray(hashMap)
    if( lastLen === hashMap.length){
        render()
        $('.success-msg').fadeIn(1000,'linear', () => {
            $('.success-msg').fadeOut(1000)
        })
    }else{
        $('.message').fadeIn(2000,'linear', () => {
            $('.message').fadeOut(1000)
        })
    }
})



window.onbeforeunload = () => {
    const urlString = JSON.stringify(hashMap)
    localStorage.setItem('urlString',urlString)
}

$(document).on('keypress', (e) => {
    const {key} = e
    for(let i = 0; i<hashMap.length;i++){
        if(hashMap[i].logo.toLowerCase() === key){
            window.open(hashMap[i].url)
        }
    }
})

$('.message').hide()
$('.success-msg').hide()