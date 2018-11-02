"use strict";
var WaveFormula = function(t) {};
WaveFormula.prototype.apply = function(t) {
    for (var e, a = Math.sqrt(t.length), s = 20, r = (a + 1) * s * .5, i = s - r, o = t.length, n = 0, l = 0, c = Math.PI * (3 - Math.sqrt(5)), h = 0; h < o; h++) e = t[h], n = h * c, l = Math.sqrt(h) / Math.sqrt(o) * i, e.setPosition(l * Math.cos(n), 0, l * Math.sin(n))
};
var SphereFormula = function(t, e) {
    this.radius = t || 4500, this.numSpirals = e || 400
};
SphereFormula.prototype.apply = function(t) {
    for (var e, a, s, r = (2 / atlas.assets.length, this.numSpirals * Math.PI / atlas.assets.length, this.radius), i = t.length, o = Math.PI * (3 - Math.sqrt(5)), n = 2 / i, l = new THREE.Vector3, c = 0; c < i; c++) e = -(c * n - 1 + n / 2), a = Math.sqrt(1 - e * e), s = c * o, t[c].position = l.set(Math.cos(s) * a, Math.sin(s) * a, e).multiplyScalar(r)
};
var bigbangFormula = function(t) {
        function e() {
            cameraControls.setState(cameraControls.IDLE), atlas.mdLabels.labels.forEach(function(t) {
                t.fadeOut()
            }), displayIntroItem = !0, cameraControls.target.position.set(0, 0, 0), camera.position.set(0, 0, 600), camera.lookAt(cameraControls.target), renderNeeded = !0;
            for (var t = 0, e = atlas.assets.length; t < e; t++) atlas.assets[t].setPosition(2 * PRNG.random() - 1, 8 + (2 * PRNG.random() - 1), -10 - .5 * t), atlas.assets[t].setColor(0, 0, 0);
            var s = atlas.getOldestAsset();
            s.setPosition(0, 0, 0), s.setColor(1, 1, 1), atlas.skipAnimation(), new ColorFormula(new THREE.Color(1, 1, 1)).apply(atlas.assets), atlas.skipAnimation(), a(), cameraControls.cameraGoto(new THREE.Vector3(camera.position.x, camera.position.y, 1e3), 3, function() {
                displayIntroItem = !1
            })
        }

        function a() {
            cameraControls.setState(cameraControls.VISUALIZER_RANDOM);
            var t = new RandomFormula({
                x: 7500
            }, "polar", (!1));
            t.apply(atlas.assets);
            var e = atlas.getOldestAsset();
            e.setPosition(0, 0, 0)
        }
        var s;
        return t.init = function(t) {
            s = t
        }, t.apply = function(t, s) {
            return s ? void a() : void e()
        }, t
    }({}),
    geometrySc = new THREE.PlaneGeometry(1, 1),
    til = 0,
    TimelineLabel = function(t, e, a, s) {
        console.log(til++), this.size = a || 512, this.reduceFactor = s || 6, this.canvas = this.createMap(t), THREE.Mesh.call(this, geometrySc, this.createMaterial(this.canvas)), this.scale.set(80, 20, 1), this.position.copy(e), this.position.x -= 15
    };
TimelineLabel.prototype = Object.create(THREE.Mesh.prototype), TimelineLabel.prototype.constructor = TimelineLabel, TimelineLabel.prototype.createMaterial = function(t) {
    var e = new THREE.Texture(t);
    return e.needsUpdate = !0, DatesMaterial.getMaterial(e)
}, TimelineLabel.prototype.createMap = function(t) {
    var e = document.createElement("canvas");
    e.width = this.size, e.height = this.size / 4;
    e.getContext("2d");
    return this.drawTimelineLabelRect(e, t), e
}, TimelineLabel.prototype.updateQuaternion = function() {
    this.quaternion.copy(camera.quaternion)
}, TimelineLabel.prototype.drawTimelineLabelRect = function(t, e) {
    var a = t.getContext("2d"),
        s = 60;
    a.font = s + "px Roboto", a.fillStyle = "white";
    var r = (a.measureText(e), t.height);
    a.fillText(e, 0, r - 5)
};
var Timescroll = function(t) {
    this.assets = t, this.loadIterations = 0, this.numYears = 0, this.updatingAssets = [], this.labels = [], this.bboxes = [], this.initialized = !1, this.margin = new THREE.Vector3(25, 35, 105), this.container = new THREE.Object3D, scene.add(this.container)
};
Timescroll.prototype.setup = function(t) {
    var e = [];
    this.assetsPerYears = {};
    for (var a, s = 0, r = this.assets.length; s < r; s++) {
        a = this.assets[s];
        var i = Model.items[a.id].year;
        i ? (i = 10 * Math.floor(i / 10), this.assetsPerYears[i] || (this.assetsPerYears[i] = {
            year: i,
            items: []
        }), this.assetsPerYears[i].items.push(a)) : e.push(a.id)
    }
    this.years = Object.keys(this.assetsPerYears), this.years.sort(function(t, e) {
        return t - e
    }), this.numYears = this.years.length, t && t(e)
}, Timescroll.prototype.clear = function() {
    for (var t = 0, e = this.assets.length; t < e; t++) this.assets[t].tween = 1;
    for (; this.container.children.length;) this.container.remove(this.container.children[0])
}, Timescroll.prototype.remove = function() {
    this.clear(), this.labels = [], scene.remove(this.container), this.container = null
}, Timescroll.prototype.reset = function() {
    this.clear()
}, Timescroll.prototype.getWidth = function() {
    return this.years.length * this.margin.z
}, Timescroll.prototype.update = function() {
    for (var t = 0; t < this.labels.length; t++) this.labels[t].updateQuaternion();
    for (var e, a, t = 0, s = this.updatingAssets.length; t < s; t++) e = this.updatingAssets[t], a = 1 - e.tween, a > .02 ? e.tween += .08 * a : e.tween = 1
}, Timescroll.prototype.layout = function() {
    var t = 20,
        e = 10,
        a = t + e,
        s = 40,
        r = 3 * t + 2 * e + s;
    this.margin.z = r;
    for (var i = 0; i < this.years.length; i++) {
        var o = this.assetsPerYears[this.years[i]],
            n = Math.ceil(o.items.length / 3),
            l = parseFloat(o.year) < 0 ? o.year.toString().replace("-", "") + " BC" : o.year,
            c = {
                year: l,
                x: i * r,
                y: 0,
                width: 3 * t + 2 * e,
                height: n * a
            };
        o.items.forEach(function(t, e, s) {
            var r = c.x + (e + (s.length > 2 ? 1 : 0)) % 3 * a,
                i = a + parseInt(e / 3) * a,
                o = 0;
            t.setPosition(r, i, o)
        }), this.bboxes.push(c)
    }
    this.initialized || (this.initialized = !0, this.createLabels(this.bboxes, r, {
        color: "#FFF",
        size: 64,
        padding: 1,
        type: "roboto"
    }))
}, Timescroll.prototype.createLabels = function(t, e, a) {
    var s = dateLabels.init(t, e, a);
    return this.container.add(s), s
}, Timescroll.prototype.getBoundingBoxByYear = function(t) {
    var e;
    return this.bboxes.forEach(function(a) {
        a.year == t && (e = a)
    }), e || this.bboxes[this.bboxes.length - 1]
}, Timescroll.prototype.burstYear = function(t) {
    return this.getWidth()
};
var introItem = function(t) {
        var e, a, s, r, i, o, n, l, c = 1024;
        t.ready = !1, t.init = function(a, s) {
            e = a, getUrlsDict([e.id], t.onUrlLoaded), l = s, t.ready = !0
        }, t.onUrlLoaded = function(e) {
            s = new Image, s.onload = function() {
                t.buildMesh()
            }, s.src = "/freefall/data/berekhat_ram.jpg"
        }, t.onImageLoaded = function() {
            s = new Image, s.onload = function() {
                t.buildMesh()
            }, s.src = window.URL.createObjectURL(a.response)
        }, t.buildMesh = function() {
            r = t.buildGeometry(e.sizeNorm.w, e.sizeNorm.h), i = t.buildMaterial(s), i.uniforms.scale.value = new THREE.Vector3(e.coords.w, e.coords.h, .965), t.position = new THREE.Vector3((-7.25), 1.5, (-1)), i.uniforms.positionOffset.value = t.position, o = new THREE.Mesh(r, i), scene.add(o), l && l()
        }, t.start = function(a) {
            if (t.ready) {
                i.uniforms.opacity.value = 0, TweenLite.to(i.uniforms.opacity, a || 1, {
                    value: 1
                });
                var s = {};
                s[c] = [e.id], lod.events.dispatch("update", {
                    assets: s
                }), t.update()
            }
        }, t.stop = function(e) {
            cancelAnimationFrame(n), t.ready && TweenLite.to(i.uniforms.opacity, e || 1, {
                value: 0,
                onUpdate: function() {
                    renderNeeded = !0
                },
                onComplete: t.dispose
            })
        }, t.update = function() {
            n = requestAnimationFrame(t.update), atlas.mdLabels.labels.forEach(function(e) {
                e.assetPosition = t.position, e.positionOffset = -9.2
            }), i.uniforms.positionOffset.value = t.position, i.uniforms.needsUpdate = !0, o.lookAt(camera.position), renderNeeded = !0
        }, t.dispose = function() {
            scene.remove(o), i.uniforms.texture.value.dispose(), i.dispose(), r.dispose()
        }, t.buildMaterial = function(t) {
            var e = document.createElement("canvas");
            e.width = e.height = c;
            var a = e.getContext("2d");
            a.drawImage(t, 0, 0, t.width, t.height, 0, 0, c, c);
            var s = new THREE.Texture(e);
            s.needsUpdate = !0;
            renderer.getSize();
            return new THREE.ShaderMaterial({
                uniforms: {
                    texture: {
                        type: "t",
                        value: s
                    },
                    ratio: {
                        type: "f",
                        value: 1
                    },
                    scale: {
                        type: "v3",
                        value: new THREE.Vector3
                    },
                    positionOffset: {
                        type: "v3",
                        value: new THREE.Vector3
                    },
                    opacity: {
                        type: "f",
                        value: 0
                    }
                },
                vertexShader: h,
                fragmentShader: p,
                transparent: !0,
                depthWrite: !0,
                depthTest: !0
            })
        };
        new THREE.PlaneBufferGeometry(1, 1);
        t.buildGeometry = function(t, e) {
            var a, s, r, i, o = new Float32Array(12),
                n = new Float32Array(8),
                l = new Uint16Array(6);
            r = .5, i = .5, a = 0, o[a++] = -r, o[a++] = -i, o[a++] = 0, o[a++] = r, o[a++] = -i, o[a++] = 0, o[a++] = -r, o[a++] = i, o[a++] = 0, o[a++] = r, o[a++] = i, o[a++] = 0, a = 0, n[a++] = 0, n[a++] = 0, n[a++] = 1, n[a++] = 0, n[a++] = 0, n[a++] = 1, n[a++] = 1, n[a++] = 1, a = 0, s = 0, l[a++] = s, l[a++] = s + 3, l[a++] = s + 2, l[a++] = s + 3, l[a++] = s, l[a++] = s + 1;
            var c = new THREE.BufferGeometry;
            return c.addAttribute("uv", new THREE.BufferAttribute(n, 2)), c.addAttribute("position", new THREE.BufferAttribute(o, 3)), c.setIndex(new THREE.BufferAttribute(l, 1)), c.needsUpdate = !0, c
        };
        var h = "\n// attribute vec2 offset;\nvarying vec2 vUv;\nuniform float ratio;\nuniform vec3 scale;\nuniform vec3 positionOffset;\n\nvoid main() {\n\tvUv = uv;\n\t\n\tvec4 transform = modelViewMatrix * vec4( position, 1.0 );\n\t\n\ttransform.xyz *= scale;\n\ttransform.xyz += positionOffset;\n\t\n\t//project position\n\tvec4 projection = projectionMatrix * transform;\n\tgl_Position = projection;\n}",
            p = "\nuniform vec3 fogColor;\nuniform float fogDistance;\n  \nuniform sampler2D texture;\nuniform float opacity;\nvarying vec2 vUv;\nvoid main(){\n\n    //texture\n    vec4 color = texture2D( texture, vUv );\n    \n    //blend\n    gl_FragColor = vec4( color.rgb, opacity );\n    \n}";
        return t
    }({}),
    App = function(t) {
        this.callbackInterval = -1, this.cameraControls = cameraControls, this.timelineOn = !1, this.isIntro = !0, this.prevSeq = null, this.chapters = {
            currentColor: new THREE.Color(16711680)
        }
    };
App.prototype.setup = function() {
    this.startScreenEl = document.body.querySelector(".start-screen"), this.startScreenEl.classList.remove("show"), this.sideContent = new Sidect, this.ui = new ChapterUi, this.onButtonsClick = this.sequenceBtnClick.bind(this);
    for (var t = 0; t < this.ui.buttons.length; t++) this.ui.buttons[t].addEventListener("click", this.onButtonsClick, !1);
    this.ui.showHeader(), this.currentColor = window.getComputedStyle(this.ui.header_el, null).getPropertyValue("background-color"), params.initHash && "" !== params.initHash ? (getDates(this.start.bind(this)), animate()) : introItem.init(atlas.getOldestAsset(), this.preloadFirstItem.bind(this)), params.isBigWallVersion && this.sequenceBtnClick()
}, App.prototype.initLoading = function() {
    tracker.sendPageView("freefall-loading"), this.startScreenEl = document.body.querySelector(".start-screen"), this.startScreenEl.classList.add("show")
}, App.prototype.preloadFirstItem = function(t) {
    getDates(this.start.bind(this)), animate()
}, App.prototype.sequenceBtnClick = function(t) {
    var e = "random";
    t && (t.preventDefault(), t.stopPropagation(), this.ui.setButtonHighlight(t.currentTarget), e = t.currentTarget.getAttribute("data-seq")), tracker.sendEvent("chapter-nav-" + this.id, "click", e), this.start(e)
}, App.prototype.update = function() {
    if (cameraControls.update(), cameraControls.state == cameraControls.VISUALIZER_WAVES) {
        var t = !0,
            e = !1,
            a = void 0;
        try {
            for (var s, r = atlas.meshes[Symbol.iterator](); !(t = (s = r.next()).done); t = !0) {
                var i = s.value;
                i.material.material.uniforms.wavesOffset.value += .01
            }
        } catch (t) {
            e = !0, a = t
        } finally {
            try {
                !t && r.return && r.return()
            } finally {
                if (e) throw a
            }
        }
        renderNeeded = !0
    }
}, App.prototype.isDirectSubValid = function() {
    var t = ["random", "sphere", "wave", "timeline"];
    return t.indexOf(params.directSub) != -1
}, App.prototype.start = function(t) {
    if (enableUI(), this.ui.hideFooterMapMenu(), t && "" != t || !params.directSub || !this.isDirectSubValid() || (t = params.directSub, this.isIntro = !1, this.ui.highlightButtonBySeqName(t), this.ui.showNavs()), this.isIntro && (!t || !this.isDirectSubValid()) && !params.isBigWallVersion) return tracker.sendPageView("freefall-intro"), displayIntroItem = !0, this.resetUrl(), this.showIntro(), this.prevSeq = null, void setTimeout(introItem.start, 1e3);
    if (params.isBigWallVersion && this.isIntro && (this.isIntro = !1, t = "random"), displayIntroItem = !1, null == this.prevSeq && "random" == t && (!params.initHash || "" === params.initHash)) return this.ui.highlightButtonBySeqName(t), this.ui.showNavs(), this.prevSeq = t, this.introAnimation(), this.startTrivia(t), this.pushUrl(t), void tracker.sendPageView("freefall-start-bigbang");
    this.startTrivia(t), this.pushUrl(t);
    var e, a = 0;
    switch (t) {
        case "random":
            var s = params.initHash && "" !== params.initHash;
            bigbangFormula.apply(atlas.assets, s), dateLabels.hide(.5), tracker.sendPageView("freefall-random");
            break;
        case "sphere":
            cameraControls.setState(cameraControls.VISUALIZER_SPHERE), e = new SphereFormula, e.apply(atlas.assets), new ColorFormula(new THREE.Color(1, 1, 1)).apply(atlas.assets), dateLabels.hide(3), tracker.sendPageView("freefall-sphere");
            break;
        case "wave":
            a = 1, cameraControls.setState(cameraControls.VISUALIZER_WAVES), e = new WaveFormula, new ColorFormula(new THREE.Color(1, 1, 1)).apply(atlas.assets), e.apply(atlas.assets), dateLabels.hide(3), tracker.sendPageView("freefall-wave");
            break;
        case "timeline":
            return this.timelineOn = !0, this.timescroll ? this.initCameraCenter() : (this.timescroll = new Timescroll(atlas.assets), this.timescroll.setup(function(e) {
                this.startScrollNoDatesItems(e, t)
            }.bind(this))), this.ui.showFooterMapMenu(), tracker.sendPageView("freefall-timeline"), this.timescroll
    }
    atlas.meshes.forEach(function(t) {
        TweenLite.to(t.material.material.uniforms.wavesAmp, 4, {
            value: a,
            onUpdate: function() {
                renderNeeded = !0
            }
        })
    }), params.initHash && "" !== params.initHash ? (atlas.skipAnimation(), cameraControls.initFromUrl(params.initHash, 0), params.initHash = "") : null != t && "random" == t || cameraControls.cameraGoto(new THREE.Vector3(0, 0, 3e4), 2)
}, App.prototype.startTrivia = function(t) {
    this.ui.showTrivia(t, this.ui.startHelp(10) ? 21 : 10), this.prevSeq = t
}, App.prototype.introAnimation = function() {
    this.ui.showNavs(), this.hideIntroText();
    var t = atlas.mdLabels.labels[0];
    t && t.fadeOut(2), setTimeout(function() {
        var t = 3;
        cameraControls.cameraGoto(new THREE.Vector3(0, 0, 1e4), t, function() {
            for (var t = 0, e = atlas.assets.length; t < e; t++) atlas.assets[t].setPosition(2 * PRNG.random() - 1, 8 + (2 * Math.random() - 1), -10 - .1 * t), atlas.assets[t].setColor(1, 1, 1);
            atlas.skipAnimation(), cameraControls.setState(cameraControls.VISUALIZER_RANDOM);
            var a = new RandomFormula({
                x: 7500
            }, "polar", (!1));
            a.apply(atlas.assets);
            var s = atlas.getOldestAsset();
            s.setPosition(0, 0, 0), cameraControls.cameraGoto(new THREE.Vector3(camera.position.x, camera.position.y, 1e3), 3)
        }, null, Expo.easeIn), setTimeout(introItem.stop, 1e3 * t - 500, 2)
    }, 1e3)
}, App.prototype.showIntro = function() {
    this.isIntro = !1, this.ui.hideNavs(), this.showIntroText(), this.showIntroDistribution()
}, App.prototype.showIntroText = function() {
    var t = document.body.querySelector(".intro-start-screen");
    t.classList.add("show");
    var e = t.querySelector(".start-btn");
    e.addEventListener("click", function() {
        tracker.sendEvent("freefall-start-btn", "click", "begin freefall"), this.start("random")
    }.bind(this), !1), e.classList.add("show"), this.introAlreadyShown = !0
}, App.prototype.showIntroDistribution = function() {
    var t = atlas.getOldestAsset();
    if (t) {
        PRNG.setSeed(0);
        for (var e = 0, a = atlas.assets.length; e < a; e++) atlas.assets[e].setPosition(1e5 * (2 * PRNG.random() - 1), 1e4, 1e5 * (2 * PRNG.random() - 1)), atlas.assets[e].setColor(0, 0, 0);
        atlas.skipAnimation();
        var s = t.sizeNorm.w;
        cameraControls.setState(cameraControls.IDLE), cameraControls.target.position.copy(t.position), camera.position.set(1.5 * -s, .5 * s, 60), camera.lookAt(cameraControls.target)
    }
}, App.prototype.hideIntroText = function() {
    var t = document.body.querySelector(".intro-start-screen");
    t.classList.remove("show")
}, App.prototype.startScrollNoDatesItems = function(t, e, a) {
    this.timelineWidth = 0, this.itemsWithoutDate = t, this.initCameraCenter()
}, App.prototype.initCameraCenter = function() {
    new ColorFormula(new THREE.Color(1, 1, 1)).apply(atlas.assets), atlas.meshes.forEach(function(t) {
        TweenLite.to(t.material.material.uniforms.wavesAmp, 4, {
            value: 0,
            onUpdate: function() {
                renderNeeded = !0
            }
        })
    }), this.timescroll.layout(), this.hideItemsNoData(this.itemsWithoutDate), cameraControls.timelineHeight = this.timescroll.timelineHeight, cameraControls.timelineWidth = this.timescroll.getWidth(), cameraControls.boundingBoxes = this.timescroll.bboxes, dateLabels.show(3), cameraControls.setState(cameraControls.TIMELINE_FLAT);
    var t = 0;
    timelineControls.setFirstLocation(this.timescroll, t)
}, App.prototype.hideItemsNoData = function(t) {
    if (t && 0 != t.length) {
        var e = atlas.getAssetsFromIds(t);
        new ColorFormula(new THREE.Color(0, 0, 0)).apply(e), new RandomFormula({
            x: 6e3
        }, "polar", (!1), 1e4).apply(e)
    }
}, App.prototype.pushUrl = function(t) {
    if (null != t && "" != t) {
        var e = getCurrentUrl();
        if (e.lastIndexOf(t) == -1) {
            var a = e.split("/");
            a.pop();
            var s = a.join("/") + "/" + t;
            history.pushState(s, null, s)
        }
    }
}, App.prototype.resetUrl = function() {
    params.directSub = "", params.initHash = "";
    var t = getCurrentUrl(),
        e = t.split("freefall/");
    e.pop();
    var a = e.join("/") + "freefall/";
    history.pushState(a, null, a)
}, setup(window.innerWidth, window.innerHeight);