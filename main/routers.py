class MainRouter:
    def _db_allways(self, model, **hints):
        if "using" in dir(model):
            return model.using
        else:
            return "default"

    def db_for_read(self, model, **hints):
        """
        Reads go to a randomly-chosen replica.
        """
        return self._db_allways(model, **hints)

    def db_for_write(self, model, **hints):
        """
        Writes always go to primary.
        """
        return self._db_allways(model, **hints)

    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed if both objects are
        in the primary/replica pool.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All non-auth models end up in this pool.
        """
        return True