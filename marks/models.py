from django.db import models
from django.utils import timezone
import datetime, pytz

# Create your models here.

class Mark(models.Model):
    description = models.CharField(max_length=300)
    created_at = models.DateTimeField(editable=False)
    modified_at = models.DateTimeField()

    @classmethod
    def find(cls, _id):
        mark = cls.objects.get(id=_id)

        return mark

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created_at = timezone.now()
        self.modified_at = timezone.now()
        return super(Mark, self).save(*args, **kwargs)

    def add_child(self, child):
        MarkParent(parent=self, child=child).save()

        return True

    def add_parent(self, parent):
        MarkParent(parent=parent, child=self).save()

        return True

    def remove_child(self, child):
        MarkParent.objects.filter(parent=self, child=child).delete()

        return True

    def remove_parent(self, parent):
        MarkParent.objects.filter(parent=parent, child=self).delete()

        return True

    def get_children(self):
        children = []
        mark_parents = MarkParent.objects.filter(parent=self.id)
        for mp in mark_parents:
            children.append(mp.child)

        return children

    def get_parents(self):
        parents = []
        mark_parents = MarkParent.objects.filter(child=self.id)
        for mp in mark_parents:
            parents.append(mp.parent)

        return parents

    def mapping(self, depth=4, include_parents=False):
        """
        {mark, children: [{
            mark, children:[{mark, children}],
            mark, children:[{mark, children}]
        }]}
        """
        mark_map = {
            'node': self,
            'children': []
        }

        if include_parents:
            mark_map['parents'] = self.get_parents()

        for child in self.get_children():
            mark_map['children'].append(child.mapping(depth=depth-1))

        return mark_map

class MarkParent(models.Model):
    parent = models.ForeignKey(Mark, on_delete=models.CASCADE, related_name='parent')
    child = models.ForeignKey(Mark, on_delete=models.CASCADE, related_name='child')
    created_at = models.DateTimeField(
        editable=False,
        default=datetime.datetime(2019, 2, 6, 0, 0, 0, 0, tzinfo=pytz.utc))
    modified_at = models.DateTimeField(
        default=datetime.datetime(2019, 2, 6, 0, 0, 0, 0, tzinfo=pytz.utc))

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created_at = timezone.now()
        self.modified_at = timezone.now()
        return super(MarkParent, self).save(*args, **kwargs)
        
