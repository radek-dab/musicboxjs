#!/bin/sh

BRPATH=$(realpath ../buildroot-2016.02)
CROSS_COMPILE=arm-none-linux-gnueabi-
ARCH=arm

export CC=$BRPATH/output/host/usr/bin/${CROSS_COMPILE}gcc
export CXX=$BRPATH/output/host/usr/bin/${CROSS_COMPILE}g++
export STAGING_DIR=$BRPATH/output/staging

npm --arch=$ARCH "$@"
