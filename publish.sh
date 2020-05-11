# publish.sh [remote_name]
# [remote_name] Optional name of remote. Default is 'origin'
#
# Builds the application and pushes to the gh-pages branch of remote_name
#

REMOTENAME=${1:-origin}
REMOTE=`git remote get-url --push ${REMOTENAME}`
echo "REMOTE: ${REMOTE}"
echo "INIT_CWD: ${INIT_CWD}"
echo "PWD: ${PWD}"
echo "pwd: `pwd`"
# env
# exit

rm -rf dist
npm run build
cp src/gh_404.html dist/404.html

if [ "${BUILD}" != "nonrootdomain" ]; then
  echo "alpha.monarchinitiative.org" > dist/CNAME
  cp src/alpha_404.html dist/404.html
fi

cd dist

git init
git add .
git commit -m "update gh-pages"
git remote add ${REMOTENAME} ${REMOTE}
git push --force ${REMOTENAME} master:gh-pages
