const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const volume = $('#volume'),
    downMenu = $('.fa-chevron-down'),
    contentTop = $('.top-bar__content'),
    topBarVolume = $('.top-bar__volume'),
    moreMusicClick = $('.more-music-click'),
    hideMusicClick = $('.hide-music-click'),
    musicList = $('.music-list'),
    iconAction = $('.icon-action'),
    playPauseBtn = $('.play-pause'),
    mainAudio = $('#main-audio'),
    playElement = $('.play-pause .fas'),
    processBarAbs = $('.progress-music'),
    processBarRun = $('.progress-music__bar'),
    nextBtn = $('.next-music'),
    prevBtn = $('.prev-music'),
    volumeIcon = $('.volume-current--icon'),
    groupControlVolume = $('.group-volume-control')
    
let randomList = []
let xR = Math.floor(Math.random() * allMusic.length)
let currentIndex = xR
let drag = false
let vDrag = false 
    
// Load music when load web
window.addEventListener("load", ()=> {
    renderAllMusic()
    loadMusicPlay(currentIndex)
    clickToSetPlayingMusic()
    dragBarMusicEvent()
    dragVolumeEvent()        
})

// event click icon volume to show control volume
volume.addEventListener('click', (e)=> {
    e.preventDefault()
    e.stopPropagation()

    downMenu.classList.add('active')
    contentTop.classList.add('active')
    volume.classList.add('active')
    volume.display = 'none'
    topBarVolume.style.display = 'block'
    groupControlVolume.classList.remove('active')

    // event click into wrapper to hide volume control
    $('.wrapper').addEventListener('click', (e)=> {
        downMenu.classList.remove('active')
        contentTop.classList.remove('active')
        volume.display = 'unset'
        volume.classList.remove('active')
        topBarVolume.style.display = 'none'
        groupControlVolume.classList.add('active')
    })
})

// event click volume
topBarVolume.addEventListener('click', (e)=> {
    e.preventDefault()
    e.stopPropagation()

    topBarVolumeDrag(e.offsetX)
})

// Click icon volume to mute or to set old volume
volumeIcon.addEventListener('click', (e)=> {
    e.preventDefault()
    e.stopPropagation()

    let fullWidthVolume = $('.top-bar__volume').clientWidth
    let volumeData = volumeIcon.getAttribute('volume-data') * fullWidthVolume
    volumeIcon.setAttribute('volume-data', mainAudio.volume)
    topBarVolumeDrag(volumeData, 'muteVol')
})

// arguments: ofX(px) -> set volume process to ofX
// muteVol: boolean check click icon in volumeIcon event
function topBarVolumeDrag(ofX, muteVol) {
    let fullWidthVolume = $('.top-bar__volume').clientWidth
    let volumeW  = ofX / fullWidthVolume
    let width = Math.ceil(volumeW * 100)

    if(ofX <= fullWidthVolume) {
        $('.volume-process').style.width = ofX + 'px'
    }
    
    if(width <= 100 && width >=0 && volumeW <= 1 && volumeW >= 0) {
        $('.volume-current').innerHTML = width
        mainAudio.volume = volumeW
        setIconVolume(width)
    }
    let volumeData = volumeIcon.getAttribute('volume-data')
    if(volumeData > 0 && muteVol !== 'muteVol') {
        volumeIcon.setAttribute('volume-data', 0)
    }
}

// Set size icon based on process width(px)
function setIconVolume(width) {
    volume.style.width = 'unset'
    volume.style.fontSize = '18px'
    volume.style.borderRadius = 'unset'
    volumeIcon.style = 'width: unset; border-radius: unset'

    if(width < 1) {
        volumeIcon.style = 'width:  12px;'
        volume.style.width = '12px'
        volume.style.fontSize = '24px'
    } else if(width <= 66) {
        volumeIcon.style = 'width: 19px; border-radius: 0 8px 10px 0;'
        volume.style.fontSize = '20px'
        volume.style.width = '20px'
        volume.style.borderRadius = '0 10px 10px 0'
    }
}

// Event drag volume PC and Mobile
function dragVolumeEvent() {
    // pc
    topBarVolume.addEventListener('mousedown', ()=> {
        vDrag = true
    })
    document.addEventListener('mouseup', ()=> {
        vDrag = false
    })
    topBarVolume.addEventListener('mousemove', (e)=> {
        if(vDrag) {
            topBarVolumeDrag(e.offsetX)
        }
    })
    
    // mobile
    topBarVolume.addEventListener('touchstart', (e)=> {
        setWidthToVolume(e)
        vDrag = true
    })
    topBarVolume.addEventListener('touchmove', (e)=> {
        if(vDrag) {
            setWidthToVolume(e)
        }
    })
    document.addEventListener('touchend', ()=> {
        vDrag = false
    })

    // Get and set width in point touch (e)
    function setWidthToVolume(e) {
        let leftX = e.target.getBoundingClientRect().left
        let value = e.touches[0].clientX - leftX
        if(value < 0) {
            value = 0
        }
        topBarVolumeDrag(value)
    }
}

// show list music
moreMusicClick.addEventListener('click', (e)=> {
    musicList.classList.add('active')
    setTimeout(()=> {
        $('.music-list__item-time.active').scrollIntoView({
            behavior: "smooth", 
            block: "nearest", 
            inline: "nearest"
        })
    }, 360 + 200)
})

// hide list music
hideMusicClick.addEventListener('click', (e)=> {
    musicList.classList.remove('active')
})

// Set icon loop, shuffle music
iconAction.addEventListener('click', ()=> {
    let getActionCurrent = iconAction.getAttribute('id')
    switch(getActionCurrent) {
        case "repeat-icon": 
            iconAction.setAttribute('id', 'repeat-1-icon')
            iconAction.title =  'Song looped'
            setRepeatOne()
            break
        case "repeat-1-icon": 
            iconAction.setAttribute('id', 'shuffle-icon')
            setShuffle()
            iconAction.title =  'Playback shuffle'
            break
        case "shuffle-icon": 
            iconAction.setAttribute('id', 'repeat-icon')
            setRepeat()
            iconAction.title =  'Playlist looped'
            break
    }
})

// event play or pause music
playPauseBtn.addEventListener('click', ()=> {
    if(playElement.classList.contains('fa-play')) {       
        mainAudio.play()
    } else {
        mainAudio.pause()
    }
})

//listener event play to change class icon
mainAudio.onplay = function() {
    playElement.classList.remove('fa-play')
    playElement.classList.add('fa-pause')
}

//listener event pause to change class icon
mainAudio.onpause = function() {
    playElement.classList.add('fa-play')
    playElement.classList.remove('fa-pause')
}

// event when time play update to call setControlBarMusicPlay()
mainAudio.addEventListener('timeupdate', ()=> {
    setControlBarMusicPlay()
})

function setControlBarMusicPlay() {
    let timerCurrent = $('.timer-current')
    let timerDuration = $('.timer-duration')
    let totalMinute, totalSec

    let duration = mainAudio.duration
    let currentTime = setTimerOfType((minu, sec)=> {
        totalMinute = minu
        totalSec = sec
    }, mainAudio, 'currentTime')
    let current5 = (currentTime / duration) * 100
    

    // When audio load full data to set duration
    mainAudio.addEventListener('loadeddata', ()=> {
        setTimerOfType((totalMinute, totalSec)=> {
            timerDuration.innerText = `${totalMinute}:${totalSec}`
        }, mainAudio)
    })
    
    // While dragging the music bar it won't work
    if(!drag) {
        timerCurrent.innerText = `${totalMinute}:${totalSec}`
        processBarRun.style.width = current5 + '%'
    }
}

// event set to time music and set width control bar
processBarAbs.addEventListener('click', (e)=> {
    let currentTime = setWidthAndCurTimeMusic(e.offsetX)
    mainAudio.currentTime = currentTime
    mainAudio.play()
})

// The function return current time, argument inside: width bar music
function setWidthAndCurTimeMusic(offsetX) {
    let fullWidtBar = processBarAbs.clientWidth
    let width = Math.floor((offsetX / fullWidtBar) * 100)
    let timerCurrent = $('.timer-current')
    
    let currentTime = mainAudio.duration / 100 * width
    let totalMinute, totalSec
    
    setTimerOfType((minu, sec)=> {
        totalMinute = minu
        totalSec = sec
    }, '', currentTime)

    if(currentTime <= mainAudio.duration && currentTime >= 0) {
        timerCurrent.innerText = `${totalMinute}:${totalSec}`
    }

    if(offsetX <= fullWidtBar)
        processBarRun.style.width = width + '%'
    
    return currentTime
}

// Event drag music bar PC and Mobile
function dragBarMusicEvent() {
    let currentTime
    // pc
    processBarAbs.addEventListener('mousedown', (e) => drag = true);
    document.addEventListener('mouseup', (e) => {
        drag = false
    });
    processBarAbs.addEventListener('mousemove', (e) => {
        if(drag) {
            setWidthAndCurTimeMusic(e.offsetX)
        }
    });
    processBarAbs.addEventListener('mouseup', (e) => {
        currentTime = setWidthAndCurTimeMusic(e.offsetX)
        mainAudio.currentTime = currentTime
        mainAudio.play()
    });

    // mobile
    processBarAbs.addEventListener('touchstart', (e)=> {        
        currentTime = getValue(e)
        drag = true
    })
    processBarAbs.addEventListener('touchmove', (e)=> {
        if(drag) {
            currentTime = getValue(e)           
        }
    })
    processBarAbs.addEventListener('touchend', ()=> {
        drag = false
        mainAudio.currentTime = currentTime
        mainAudio.play()
    })

    function getValue(e) {
        let leftX = e.target.getBoundingClientRect().left
        let value = e.touches[0].clientX - leftX
        if(value < 0) {
            value = 0
        }
        return setWidthAndCurTimeMusic(value)  
    }
}

nextBtn.addEventListener('click', ()=> {
    checkActionMusic('next')
})

prevBtn.addEventListener('click', ()=> {
    checkActionMusic('prev')
})

mainAudio.addEventListener('ended', ()=> {
    checkActionMusic('ended')
})

function checkActionMusic(isPrev) {
    let textAction = iconAction.id

    switch(textAction) {
        case "repeat-icon": 
            if(isPrev === 'prev') {
                prevMusic()
            } else {
                nextMusic()
            }
            loadMusic()
            break
        case "repeat-1-icon": 
            if(isPrev === 'prev') {
                prevMusic()
            } else if(isPrev === 'next') {
                nextMusic()
            } else {
                mainAudio.play()
                break
            }
            loadMusic()
            break
        case "shuffle-icon": 
            loadRandomMusic()
            loadMusic()
            break
    }
}

function loadMusic() {
    loadMusicPlay(currentIndex)
    mainAudio.play()
    reSetPlaying()
}

function prevMusic() {
    currentIndex--
    if(currentIndex < 0) {
        currentIndex = allMusic.length - 1
    }
}

function nextMusic() {
    currentIndex++
    if(currentIndex > allMusic.length - 1) {
        currentIndex = 0
    }
}
// create randomIndex add to randomList
function loadRandomMusic() {
    let randomIndex
    if(randomList.length === allMusic.length) 
        randomList = []

    do {
        randomIndex = Math.floor(Math.random() * allMusic.length)
    } while (randomIndex === currentIndex || randomList.includes(randomIndex))

    currentIndex = randomIndex
    randomList.push(randomIndex)
}

// reset text playing and duration in playlist when load new music
function reSetPlaying() {
    const musicActive = $('.music-list__item-time.active'),
        musicListItem = $$('.music-list__item')
    musicActive.innerText = musicActive.getAttribute('data-duration')
    musicActive.classList.remove('active')

    musicListItem[currentIndex].querySelector('.music-list__item-time').innerText = 'Playing'
    musicListItem[currentIndex].querySelector('.music-list__item-time').classList.add('active')
}

// Select music in playlist to set status playing
function clickToSetPlayingMusic() {
    let musicListItem = $$('.music-list__item')
    musicListItem.forEach(element => {        
        element.addEventListener('click', ()=> {
            let active = $('.music-list__item-time.active')
            if(active) {
                active.innerText = active.getAttribute('data-duration')
                active.classList.remove('active')
            }

            currentIndex = element.id

            let textPlaying = element.querySelector('.music-list__item-time')
            textPlaying.innerText = 'Playing'
            textPlaying.classList.add('active')

            loadMusic()
        })
    })
}

// render music to list
function renderAllMusic() {
    if(!allMusic) {
        console.error("Not found all Music")
        return
    } 
    let htmls = allMusic.map((element, index) => {
        let classPlaying = ''
        if(index === currentIndex) {
            classPlaying = 'active'
        }
        return `
            <li class="music-list__item" id="${index}">
                <div class="music-list__item-first">
                    <p class="music-list__item-name">${element.name}</p>
                    <p class="music-list__item-des">${element.artist}</p>
                </div>
                <div class="music-list__item-last">
                    <audio class="list-temp__audio" src="./assets/songs/${element.src}"></audio>
                    <span class="music-list__item-time ${classPlaying}" data-duration=""></span>
                </div>
            </li>
        `
    })
    $('.music-list__play').innerHTML = htmls.join('')

    renderListDuration()
}

function renderListDuration() {
    let list = $$('.music-list__item-last')
    list.forEach((element, index) => {
        let audioList = element.querySelector('.list-temp__audio')
        let timeDuration = element.querySelector('.music-list__item-time')
        audioList.addEventListener('loadeddata', ()=> {

            setTimerOfType((minu, sec)=> {
                let playingTextList = `${minu}:${sec}`

                if(index === currentIndex) 
                    playingTextList = 'Playing'

                timeDuration.innerText = playingTextList
                timeDuration.setAttribute('data-duration', `${minu}:${sec}`)
            }, audioList)                

        })
    })
}

// aguments: audiolist(main audio), calback(total minute, total sec)
function setTimerOfType(callback, audioList, type = 'duration') {
    let typeSet
    switch (type) {
        case 'duration':
            typeSet = audioList.duration
            break;
        case 'currentTime':
            typeSet = audioList.currentTime
            break;
        default:
            typeSet = Number(type)
            break;
    }
    let totalMinute = Math.floor(typeSet / 60)
    let totalSec = Math.floor(typeSet % 60)

    if(totalSec < 10) {
        totalSec = '0' + totalSec
    }
    callback(totalMinute, totalSec)
    return typeSet
}

// loadMusicPlay
function loadMusicPlay(currentIndex) {
    if(!allMusic) {
        console.error("Not found all Music")
        return
    } 
    $('.song-detail__name').innerText = allMusic[currentIndex].name
    $('.song-detail__describe').innerText = allMusic[currentIndex].artist
    $('.img-playing img').src = './assets/images/' + allMusic[currentIndex].img
    $('.img-playing img').alt = allMusic[currentIndex].name    
    mainAudio.src = './assets/songs/' + allMusic[currentIndex].src
}