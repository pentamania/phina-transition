import phina from "phina.js";

import "./TransitionScene.js"
import "./ClippedTransitionScene.js"
import {ClippedLayer, CircleClippedLayer} from "./clippedlayers"
phina.register('phina.transition.ClippedLayer', ClippedLayer);
phina.register('phina.transition.CircleClippedLayer', CircleClippedLayer);