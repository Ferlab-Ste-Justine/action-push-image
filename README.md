# About

Github action to build and push docker images on a docker registry according to a specified tag format.

# Inputs

The action takes the following inputs:
- **server**: Image registry to logon to. Defaults to dockerhub ("https://index.docker.io/v1/")
- **username**: Username to login to the registry with
- **password**: Password to use to login to the registry
- **image**: Image repo (qualified by organization name and repo name) to use to push the image
- **tag_format**: Format of the image tag. The following special strings will be replaced: "{semver}", "{sha}", "{timestamp}". They are placeholders for a tag following the **vx.y.z** semver format, the commit sha or the timestamp indicated as the number of seconds since epoch respectively
- **location**: Location relative to the root of the repo where the dockerfile is. Defaults to '.' (ie, the root of the repo)
- **dockerfile**: Name of the dockerfile. Defaults to 'Dockerfile'.
