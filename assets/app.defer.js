// Deferred non-critical initializers
window.addEventListener('load', function(){
  try {
    setTimeout(function(){
      if (typeof window.replaceWithWebP === 'function') window.replaceWithWebP();
      if (typeof window.addMissingImageDimensions === 'function') window.addMissingImageDimensions();
      if (typeof window.addLazyLoading === 'function') window.addLazyLoading();
    }, 300);
  } catch (e) {
    console.warn('Deferred image init error', e);
  }
});
