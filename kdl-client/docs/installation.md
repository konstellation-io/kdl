# Installation

## Linux

There are two different paths in order to install the desktop application: using an AppImage file or installing through Snapcraft. We recommend the use of the AppImage file to install the application.

### AppImage installation

AppImage allows the linux user to install an application the same way we can do with a Windows os MacOS application.

To start the application, you need to [download](https://github.com/konstellation-io/kdl/releases) it from GitHub, and then you need to make the file executable by changing the permission through the properties menu of the file of by executing:

```bash
chmod a+x konstellation-dev-lab*.AppImage
```

Now that the file is executable, you can execute the file directly or using a terminal:

```bash
./konstellation-dev-lab*.AppImage
```

If you want to get additional functionality such as application icon, shortcuts and autoexecutable AppImage files, use appimaged and appimagetool. More info [here](https://github.com/probonopd/go-appimage).

More info about AppImage [here](https://appimage.org/).

### Snapcraft installation

Access [KDL snap page](https://intelygenz.zoom.us/j/99817136044?pwd=RDN5RFNGd3BORC9CYVpiNktGSnQ0Zz09) and follow the instructions to install the application.

## Windows

To start the application, you need to [download](https://github.com/konstellation-io/kdl/releases) the `./konstellation-dev-lab-*.exe` and execute the file.

This application uses a one click installer, so you just need to run the `.exe` file and the installation will occur then.

## MacOS
To start the application, you need to [download the `.dmg` file](https://github.com/konstellation-io/kdl/releases)  from GitHub, and then double click on the file and follow the instructions. Once you move your app in the Application folder as the instructions suggested you can find KDL app in the Spotlight.
