class Test {
  runTest() {
    logger.log('Test core client code success');
  }
}

const testCore = new Test();
window.testCore = testCore;
