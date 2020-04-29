<?php
/*
    library for php's memcached & javascript's storage
php:
    function StorageClass.write_script();
    function StorageClass.isSupported();
    function StorageClass.set($name, $value, $expired = 0);
    function StorageClass.get($name);
    function StorageClass.getDelayed($nameArray);
    function StorageClass.fetch();
    function StorageClass.fetchAll();
javascript:
    function StorageClass.isSupported();
    function StorageClass.setLocal(name, value);
    function StorageClass.getLocal(name);
    function StorageClass.removeLocal(name);
    function StorageClass.setSession(name, value);
    function StorageClass.getSession(name);
    function StorageClass.removeSession(name);
    function StorageClass.getTempVarIndex();
    function StorageClass.getTempVarValue(index);
    function StorageClass.setTempVarValue([optional] index, value);
*/

$storage_script_written = 0;

class StorageClass {

    public static function write_script() {
        global $storage_script_written;
        if ($storage_script_written != 0) return;
        $storage_script_written = 1;
        ?>
        <script type="text/javascript">
            var StorageClass = {
                tempvars: [],

                isSupported: function () {
                    if(typeof(Storage) !== "undefined") return true;
                    return false;
                },

                setLocal: function (name, value) {
                    localStorage.setItem(name + "", value);
                },

                getLocal: function (name) {
                    return localStorage.getItem(name + "");
                },

                removeLocal: function (name) {
                    window.localStorage.removeItem(name + "");
                },

                setSession: function (name, value) {
                    sessionStorage.setItem(name + "", value);
                },

                getSession: function (name) {
                    return sessionStorage.getItem(name + "");
                },

                removeSession: function (name) {
                    window.sessionStorage.removeItem(name + "");
                },

                getTempVarIndex : function () {
                    var i;
                    for (i = 0; i < StorageClass.tempvars.length; i++) {
                        if (StorageClass.tempvars[i].ready) {
                            StorageClass.tempvars[i].ready = false;
                            return i;
                        }
                    }
                    i = StorageClass.tempvars.length;
                    StorageClass.tempvars.push({
                        ready: false,
                        value: null
                    });
                    return i;
                },

                getTempVarValue : function (index) {
                    var v = StorageClass.tempvars[index].value;
                    StorageClass.tempvars[index].ready = true;
                    return v;
                },

                setTempVarValue : function (index, value) {
                    if (value === undefined) {
                        value = index;
                        index = StorageClass.getTempVarIndex();
                    }
                    StorageClass.tempvars[index].value = value;
                    return index;
                }
            }
        </script>
<?php
    }

    public static function isSupported() {
        if (class_exists('Memcached', false)) return true;
        return false;
    }

    public $entity = null;

    public function __construct($hostname = "localhost", $port = 11211) {
        $entity = new Memcached();
        $entity->addServer($hostname, $port);
    }

    public function __destruct() {
        $entity->quit();
        unset($entity);
    }

    public function set($name, $value, $expired = 0) {
        return $entity->set($name, $value, $expired);
    }

    public function get($name) {
        return $entity->get($name);
    }

    public function getDelayed($nameArray) {
        return $entity->getDelayed($nameArray, true);
    }

    public function fetch() {
        return $entity->fetch();
    }

    public function fetchAll() {
        return $entity->fetchAll();
    }
}
?>
