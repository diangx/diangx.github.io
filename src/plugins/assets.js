const requireContextPlay = require.context('@/assets/play', false, /\.(png|jpe?g|svg)$/);
const requireContextKt = require.context('@/assets/kt', false, /\.(png|jpe?g|svg)$/);
const requireContextServer = require.context('@/assets/server', false, /\.(png|jpe?g|svg)$/);
const requireContextMcs = require.context('@/assets/mcs', false, /\.(png|jpe?g|svg)$/);

const images = {};

function importAll(requireContext) {
  requireContext.keys().forEach(fileName => {
    const imageKey = fileName.replace('./', '').replace(/\.\w+$/, '');
    images[imageKey] = requireContext(fileName);
  });
}

importAll(requireContextPlay);
importAll(requireContextKt);
importAll(requireContextServer);
importAll(requireContextMcs);

export default images;
