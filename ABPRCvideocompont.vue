<template>
    <!-- 獨立出來一個播放視頻的組件 -->
    <div class="ABPRC-Unit" :class="{'ABPRC-FullScreen':fullScreen }" @mouseover="onControl(true)" @mouseout="onControl(false)" >                        
        <div class="ABPRC-Video" @click="onPlay" >
            <div class="ABPRC-Container"></div>
            <div class="ABPRC-info" v-if="dialogData.share">
               <p class="title">{{dialogData.title || ''}}</p>
               <p class="nick">{{dialogData.nick || ''}}</p>
            </div>
            <video id="ABPRCPlayer" :src="dialogData.path" crossorigin preload autoplay playsinline loop >
                <!-- <source :src="dialogData.path" type="video/mp4" /> -->
            </video>
        </div>
        <div class="ABPRC-Control" :class="[ Control ? 'fadeIn animated' : 'fadeOut animated']">
            <div class="button ABPRC-Play" :class="{'ABPRC-Pause' : playing}"  @click="onPlay"></div>
            <div class="progress-bar">
                <div class="bar dark" :style="barTime.style"></div>
                <div class="bar" :style="barLoad.style"></div>
            </div>
            <!-- <div class="button ABPRC-CommentShow"></div> -->
            <div class="button ABPRC-FullScreen" @click="onFullScreen"></div>
        </div>
    </div>          
</template>

<script>
import { browserPlatform } from "src/api/util";
export default {
  data() {
      //传入的参数
      // dialogData  =  {
      //   "uid": 111,
			// 	"nick": "fcsfdsf",
			// 	"id": "1",
			// 	"title": "test",
			// 	"path": "https://ttvideo-cdnqn.52tt.com/o_1c4m5h7u099m11salku1t761jmoa.mp4",
			// 	"status": "1",
			// 	"cate": "1",
      //   "score": 1
      //   };        
    return {
      playing: false,
      fullScreen: false,
      Control:true,
      barTime: {
        style: {
          width: 0
        }
      },
      barLoad: {
        style: {
          width: 0
        }
      }
    };
  },
  props:['dialogData'],
  components: {},
  methods: {
    onControl(bool,time){
      const vm = this
       this.Control = bool;
       time && setTimeout(() => {
          vm.Control = false
      }, time*5);
    },
    onPlay() {
      const video = document.getElementById("ABPRCPlayer");
      this.onControl(true,2000);
      if (!this.playing) {
        video.play();
        this.playing = true;
        this.swapVideo();
      } else {
        video.pause();
        this.playing = false;
      }
    },
    onFullScreen() {
      this.fullScreen = !this.fullScreen;
    },
    swapVideo() {
      var ABPInst = this;
      var video = document.getElementById("ABPRCPlayer");

      video.addEventListener("timeupdate", function() {
        ABPInst.barTime.style.width =
          video.currentTime / video.duration * 100 + "%";
      });
      video.addEventListener("ended", function() {
        ABPInst.btnPlay.className = "button ABP-Play";
        ABPInst.barTime.style.width = "0%";
      });
      video.addEventListener("progress", function() {
        if (this.buffered != null) {
          try {
            var s = this.buffered.start(0);
            var e = this.buffered.end(0);
          } catch (err) {
            return;
          }
          var dur = this.duration;
          var perc = e / dur * 100;
          ABPInst.barLoad.style.width = perc + "%";
        }
      });
      video.addEventListener("loadedmetadata", function() {
        if (this.buffered != null) {
          try {
            var s = this.buffered.start(0);
            var e = this.buffered.end(0);
          } catch (err) {
            return;
          }
          var dur = this.duration;
          var perc = e / dur * 100;
          ABPInst.barLoad.style.width = perc + "%";
        }
      });

      video.addEventListener("play", function() {
        try {
          var e = this.buffered.end(0);
          var dur = this.duration;
          var perc = e / dur * 100;
          ABPInst.barLoad.style.width = perc + "%";
        } catch (err) {}
      });

      var pbar = document.getElementsByClassName("progress-bar");
      if (pbar.length <= 0) return;
      ABPInst.barHitArea = pbar[0];
      ABPInst.video = document.getElementById("ABPRCPlayer");
      var dragging = false;

      ABPInst.barHitArea.addEventListener("mousedown", function(e) {
        dragging = true;
      });
      document.addEventListener("mouseup", function(e) {
        dragging = false;
      });
      ABPInst.barHitArea.addEventListener("mouseup", function(e) {
        dragging = false;
        var newTime = (ABPInst.fullScreen ? e.pageX : e.layerX) / this.offsetWidth * ABPInst.video.duration;
        ABPInst.video.currentTime = newTime;
      });
      ABPInst.barHitArea.addEventListener("mousemove", function(e) {
        if (dragging) {
          ABPInst.barTime.style.width = (ABPInst.fullScreen ? e.pageX : e.layerX) * 100 / this.offsetWidth + "%";
        }
      });
    }
  },
  mounted: function() {
    var vm = this;
      setTimeout(() => {
        vm.onPlay();
        //蘋果瀏覽器依然為暫停自動播放
        if(browserPlatform().mobile &&browserPlatform().ios ) vm.playing = false
      }, 500);
  },
  computed: {
    
  }
};
</script>
<style lang="less" scope>
//獨立出來一個組件啊大佬們
.ABPRC-Unit {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
}
.ABPRC-Unit video {
  width: 100%;
  height: 100%;
}
.ABPRC-Unit .ABPRC-Control {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  opacity: 0.9;
  border-top: 1px solid #33b5e5;
  height: 40px;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.ABPRC-Unit.ABPRC-FullScreen {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: auto !important;
  height: auto !important;
  position: fixed;
  z-index: 99999999;
  background: #000;
}

.ABPRC-Unit .ABPRC-Video {
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 12px;
  background: #000;
}

.ABPRC-Unit .ABPRC-Video .ABPRC-Container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0;
  z-index: 9;
  overflow: hidden;
  bottom: 40px;
}

.ABPRC-Unit .ABPRC-Video .ABPRC-info {
  position: absolute;
  bottom: 40px;
  left: 20px;
  p {
    color: #fff;
    &.title {
      font-size: 16px;
    }
    &.nick {
      font-size: 14px;
    }
  }
}

.ABPRC-Unit .ABPRC-Control:hover {
  opacity: 1;
}

.ABPRC-Unit .ABPRC-Control .button {
  position: absolute;
  overflow: hidden;
  background-color: #000;
  width: 40px;
  top: 0;
  bottom: 0;
  -webkit-transition: background-color 0.2s ease-in-out;
  transition: background-color 0.2s ease-in-out;
}

.ABPRC-Unit .ABPRC-Control .button:hover {
  background-color: #6cf;
}

.ABPRC-Unit .ABPRC-Control .ABPRC-Play {
  background-image: url("@{img-url}play.png");
  background-size: cover;
  left: 0;
}

.ABPRC-Unit .ABPRC-Control .ABPRC-Play.ABPRC-Pause {
  background-image: url("@{img-url}pause.png");
}

.ABPRC-Unit .ABPRC-Control .ABPRC-FullScreen {
  background-image: url("@{img-url}fullscreen.png");
  background-size: cover;
  right: 0;
}

.ABPRC-Unit .ABPRC-Control .ABPRC-CommentShow {
  background-image: url("@{img-url}danmaku.png?");
  background-size: cover;
  top: 0;
  right: 40px;
  bottom: 0;
}

.ABPRC-Unit .ABPRC-Control .progress-bar {
  position: absolute;
  overflow: hidden;
  cursor: default;
  top: 0;
  right: 40px;
  bottom: 0;
  left: 40px;
  background: #000;
  .bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #4399ee;
    opacity: 0.4;
    &.dark {
      background: #09c;
      opacity: 1;
    }
  }
}
</style>