import {put, takeEvery} from 'redux-saga/effects';
import {getRandomCollection, shuffle} from '../../utils/helper';
import {updateStudentDataAsync} from '../db';

function * selectionChanged(action) {
  try {
    if (action.selectedSoundIndex === action.correctSoundIndex) {
      let nextIndex = action.sequenceIndex + 1;

      if (action.manualTestIndex == null) {
        if (nextIndex > 5) {
          nextIndex = 0;
          let newSequence = shuffle(action.sequence);

          yield put({
            type: "BUILD_NEW_SEQUENCE",
            sequence: newSequence
          });

          yield put({
            type: "QUESTIONS_NEW",
            payload: getRandomCollection(newSequence[nextIndex], action.lingSoundCount)
          });
        } else {

          yield put({type: "INCREMENT_SEQUENCE_INDEX", payload: nextIndex});

          yield put({
            type: "QUESTIONS_NEW",
            payload: getRandomCollection(action.sequence[nextIndex], action.lingSoundCount)
          });
        }

      } else {

      yield put({
        type: "QUESTIONS_NEW",
        payload: getRandomCollection(action.manualTestIndex, action.lingSoundCount)
      });
    }
      console.log("end of saga correct answer: ", nextIndex);
    } else {
      yield put({type: "QUESTIONS_REDO"})
    }

    yield updateStudentDataAsync(action.currentStudent, action.visualProp, action.displayedSounds, action.selectedSoundIndex, action.correctSoundIndex, Date.now());
  } catch (e) {
    yield console.log("Error");
    yield console.log(e);
    //error action.
  }
}

function * selectionSaga() {
  yield takeEvery("SUBMIT", selectionChanged);
}

export default[selectionSaga];