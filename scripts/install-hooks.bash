#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

echo "Installing hooks..."

# this command creates a symlink to our pre-commit script
ln -s ../../scripts/pre-push.bash $GIT_DIR/hooks/pre-push
echo "Done!"
