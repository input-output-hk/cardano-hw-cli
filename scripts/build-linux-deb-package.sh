#!/bin/bash

PACKAGE='cardano-hw-cli'
VERSION='1.0.0-1' # majorVersion.minorVersion.patchVersion-packageRevision
ARCHITECTURE='i386'
MAINTAINER='Peter Benc <peter.benc@vacuumlabs.com>, David Tran Duc <david.tran.duc@vacuumlabs.com>'
DESCRIPTION='Cardano hw cli
 Command line tool for ledger/trezor transaction signing'

cd ${0%/*}
cd ..

yarn build

sudo rm -rf ./build-linux-deb

mkdir ./build-linux-deb
mkdir ./build-linux-deb/${PACKAGE}_${VERSION}
mkdir ./build-linux-deb/${PACKAGE}_${VERSION}/usr
mkdir ./build-linux-deb/${PACKAGE}_${VERSION}/usr/bin
mkdir ./build-linux-deb/${PACKAGE}_${VERSION}/usr/share
mkdir ./build-linux-deb/${PACKAGE}_${VERSION}/usr/share/cardano-hw-cli
mkdir ./build-linux-deb/${PACKAGE}_${VERSION}/DEBIAN

cp -R ./build/Release ./build-linux-deb/${PACKAGE}_${VERSION}/usr/share/cardano-hw-cli
cp ./package.json ./build-linux-deb/${PACKAGE}_${VERSION}/usr/share/cardano-hw-cli
cp ./build/cardano-hw-cli ./build-linux-deb/${PACKAGE}_${VERSION}/usr/share/cardano-hw-cli
ln -s /usr/share/cardano-hw-cli/cardano-hw-cli ./build-linux-deb/${PACKAGE}_${VERSION}/usr/bin

CONTROL="Package: $PACKAGE
Version: $VERSION
Architecture: $ARCHITECTURE
Maintainer: $MAINTAINER
Description: $DESCRIPTION"

echo "$CONTROL" >> ./build-linux-deb/${PACKAGE}_${VERSION}/DEBIAN/control

dpkg-deb --build ./build-linux-deb/${PACKAGE}_${VERSION}